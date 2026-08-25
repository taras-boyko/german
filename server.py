#!/usr/bin/env python3
"""Serve the lesson UI and persist its completed-series history locally."""

from __future__ import annotations

import argparse
import json
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
HISTORY_PATH = ROOT / "data" / "lesson-history.json"
MAX_HISTORY_BYTES = 1_000_000


def empty_history() -> dict[str, object]:
    return {
        "version": 2,
        "lessons": {},
        "activity": {"attempts": 0, "correct": 0, "days": {}},
        "completedStages": {},
    }


def normalize_history(value: object) -> dict[str, object]:
    if not isinstance(value, dict) or not isinstance(value.get("lessons"), dict):
        raise ValueError("History must contain a lessons object.")

    lessons: dict[str, dict[str, object]] = {}
    for lesson_id, lesson in value["lessons"].items():
        if not isinstance(lesson_id, str) or not isinstance(lesson, dict):
            raise ValueError("Each lesson history entry must be an object.")
        attempts = lesson.get("attempts")
        correct = lesson.get("correct")
        last_practiced = lesson.get("lastPracticed")
        if (
            not isinstance(attempts, int)
            or not isinstance(correct, int)
            or attempts < 0
            or correct < 0
            or correct > attempts
            or not isinstance(last_practiced, str)
        ):
            raise ValueError("Lesson history contains invalid values.")
        lessons[lesson_id] = {
            "attempts": attempts,
            "correct": correct,
            "lastPracticed": last_practiced,
        }

    activity = value.get("activity", empty_history()["activity"])
    if not isinstance(activity, dict):
        raise ValueError("Activity history must be an object.")
    attempts = activity.get("attempts")
    correct = activity.get("correct")
    days = activity.get("days")
    if (
        not isinstance(attempts, int)
        or not isinstance(correct, int)
        or attempts < 0
        or correct < 0
        or correct > attempts
        or not isinstance(days, dict)
    ):
        raise ValueError("Activity history contains invalid values.")
    normalized_days: dict[str, int] = {}
    for date, count in days.items():
        if not isinstance(date, str) or not isinstance(count, int) or count < 0:
            raise ValueError("Activity day counts must be non-negative integers.")
        normalized_days[date] = count

    completed_stages = value.get("completedStages", {})
    if not isinstance(completed_stages, dict):
        raise ValueError("Completed stages must be an object.")
    normalized_stages: dict[str, list[str]] = {}
    for lesson_id, stages in completed_stages.items():
        if (
            not isinstance(lesson_id, str)
            or not isinstance(stages, list)
            or not all(isinstance(stage_id, str) for stage_id in stages)
        ):
            raise ValueError("Completed stages must contain lists of stage identifiers.")
        normalized_stages[lesson_id] = list(dict.fromkeys(stages))

    return {
        "version": 2,
        "lessons": lessons,
        "activity": {
            "attempts": attempts,
            "correct": correct,
            "days": normalized_days,
        },
        "completedStages": normalized_stages,
    }


def load_history() -> dict[str, object]:
    if not HISTORY_PATH.exists():
        return empty_history()
    try:
        return normalize_history(json.loads(HISTORY_PATH.read_text(encoding="utf-8")))
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"Could not load {HISTORY_PATH}: {error}")
        return empty_history()


def save_history(history: dict[str, object]) -> None:
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = HISTORY_PATH.with_suffix(".tmp")
    temporary_path.write_text(
        json.dumps(history, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary_path.replace(HISTORY_PATH)


class LessonServer(ThreadingHTTPServer):
    lesson_history: dict[str, object]


class LessonRequestHandler(SimpleHTTPRequestHandler):
    def send_json(self, status: HTTPStatus, payload: dict[str, object]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if urlparse(self.path).path == "/api/lesson-history":
            self.send_json(HTTPStatus.OK, self.server.lesson_history)
            return
        super().do_GET()

    def do_PUT(self) -> None:
        if urlparse(self.path).path != "/api/lesson-history":
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        content_length = self.headers.get("Content-Length")
        if content_length is None:
            self.send_error(HTTPStatus.LENGTH_REQUIRED)
            return
        try:
            body_length = int(content_length)
        except ValueError:
            self.send_error(HTTPStatus.BAD_REQUEST, "Invalid Content-Length.")
            return
        if body_length < 0 or body_length > MAX_HISTORY_BYTES:
            self.send_error(HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
            return

        try:
            history = normalize_history(json.loads(self.rfile.read(body_length)))
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as error:
            self.send_error(HTTPStatus.BAD_REQUEST, str(error))
            return

        try:
            save_history(history)
        except OSError as error:
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, str(error))
            return

        self.server.lesson_history = history
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", default=4173, type=int)
    arguments = parser.parse_args()

    server = LessonServer((arguments.bind, arguments.port), LessonRequestHandler)
    server.lesson_history = load_history()
    print(f"Listening on port {arguments.port} at http://{arguments.bind}:{arguments.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
