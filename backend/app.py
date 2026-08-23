"""Small local API for TaskNest development. Run with: python3 backend/app.py"""
from __future__ import annotations

import base64
import hashlib
import json
import re
import secrets
import sqlite3
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = "127.0.0.1"
PORT = 8000
DB_PATH = Path(__file__).with_name("tasknest.db")
ALLOWED_SERVICES = {"carpenter", "electrician", "desktop-repair"}
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.com$", re.IGNORECASE)


def database() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialise_database() -> None:
    with database() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                phone TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('customer', 'worker')),
                services_json TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL
            )
            """
        )


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived_key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 600_000)
    return "pbkdf2_sha256$600000${}${}".format(
        base64.b64encode(salt).decode(), base64.b64encode(derived_key).decode()
    )


def validate(payload: dict) -> tuple[dict, dict]:
    errors: dict[str, str] = {}
    full_name = str(payload.get("fullName", "")).strip()
    phone = str(payload.get("phone", ""))
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))
    role = str(payload.get("role", ""))
    services = payload.get("services", [])

    if len(full_name) < 2:
        errors["fullName"] = "Enter your full name."
    elif len(full_name.split()) > 3:
        errors["fullName"] = "Use no more than 3 words for your full name."
    if not re.fullmatch(r"\d{10}", phone):
        errors["phone"] = "Enter a valid 10-digit mobile number."
    if not EMAIL_PATTERN.fullmatch(email):
        errors["email"] = "Enter an email address ending in .com."
    if len(password) < 8:
        errors["password"] = "Password must be at least 8 characters."
    if role not in {"customer", "worker"}:
        errors["role"] = "Choose customer or worker."
    if not isinstance(services, list):
        errors["services"] = "Services must be a list."
        services = []
    elif role == "worker" and not services:
        errors["services"] = "Select at least one service."
    elif any(service not in ALLOWED_SERVICES for service in services):
        errors["services"] = "One or more selected services are invalid."

    return errors, {"full_name": full_name, "phone": phone, "email": email, "password": password, "role": role, "services": services}


class ApiHandler(BaseHTTPRequestHandler):
    def send_json(self, status: HTTPStatus, body: dict) -> None:
        encoded = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Access-Control-Allow-Origin", "http://localhost:5173")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(encoded)

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "http://localhost:5173")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()

    def do_POST(self) -> None:
        if self.path != "/api/signup":
            self.send_json(HTTPStatus.NOT_FOUND, {"message": "Route not found."})
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(size))
        except (ValueError, json.JSONDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"message": "Send valid JSON."})
            return
        if not isinstance(payload, dict):
            self.send_json(HTTPStatus.BAD_REQUEST, {"message": "Send an object."})
            return

        errors, user = validate(payload)
        if errors:
            self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"errors": errors})
            return
        try:
            with database() as connection:
                cursor = connection.execute(
                    """INSERT INTO users (full_name, phone, email, password_hash, role, services_json, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (user["full_name"], user["phone"], user["email"], hash_password(user["password"]), user["role"], json.dumps(user["services"]), datetime.now(timezone.utc).isoformat()),
                )
            self.send_json(HTTPStatus.CREATED, {"id": cursor.lastrowid, "role": user["role"]})
        except sqlite3.IntegrityError as error:
            field = "email" if "email" in str(error).lower() else "phone"
            self.send_json(HTTPStatus.CONFLICT, {"errors": {field: f"This {field} is already registered."}})

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    initialise_database()
    print(f"TaskNest API running at http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), ApiHandler).serve_forever()
