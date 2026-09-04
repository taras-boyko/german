#!/usr/bin/env python3
"""Serve the lesson UI and persist its completed-series history locally."""

from __future__ import annotations

import argparse
import copy
import json
import threading
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
HISTORY_PATH = ROOT / "data" / "lesson-history.json"
MAX_HISTORY_BYTES = 1_000_000


class UnsupportedHistoryVersion(ValueError):
    pass


def empty_history() -> dict[str, object]:
    return {
        "version": 4,
        "lessons": {},
        "activeSession": None,
        "activeSessionUpdatedAt": None,
        "pendingCompletion": None,
        "pendingCompletionUpdatedAt": None,
        "pendingCompletions": {},
        "resolvedCompletions": {},
        "recentVariants": {},
        "lastPasses": {},
        "activityByDate": {},
        "baseline": {"lessons": {}, "activityByDate": {}},
        "deviceContributions": {},
    }


def normalize_history(value: object) -> dict[str, object]:
    if not isinstance(value, dict):
        raise ValueError("History must be an object.")
    version = value.get("version")
    if isinstance(version, int) and version > 4:
        raise UnsupportedHistoryVersion(
            f"History version {version!r} is newer or unsupported."
        )
    if not isinstance(value.get("lessons"), dict):
        raise ValueError("History must contain a lessons object.")

    if version == 2:
        return migrate_version_two(value)
    if version == 3:
        value = {**value, "version": 4}
        version = 4
    if version != 4:
        raise UnsupportedHistoryVersion(
            f"History version {version!r} is newer or unsupported."
        )

    lessons: dict[str, dict[str, object]] = {}
    for lesson_id, lesson in value["lessons"].items():
        if not isinstance(lesson_id, str) or not isinstance(lesson, dict):
            raise ValueError("Each lesson history entry must be an object.")
        attempts = non_negative_integer(lesson.get("attempts", 0), "Lesson attempts")
        first_attempts = non_negative_integer(
            lesson.get("firstAttempts", attempts), "Lesson first attempts"
        )
        first_correct = non_negative_integer(
            lesson.get("firstAttemptCorrect", 0), "Lesson correct answers"
        )
        if first_correct > first_attempts or first_attempts > attempts:
            raise ValueError("Lesson answer totals are inconsistent.")
        lessons[lesson_id] = {
            "completedLearn": string_list(lesson.get("completedLearn", [])),
            "masteredPractice": string_list(lesson.get("masteredPractice", [])),
            "learnedTargets": string_list_map(lesson.get("learnedTargets", {})),
            "masteredTargets": string_list_map(lesson.get("masteredTargets", {})),
            "attempts": attempts,
            "firstAttempts": first_attempts,
            "firstAttemptCorrect": first_correct,
            "lastPracticedAt": optional_string(lesson.get("lastPracticedAt")),
            "dueAt": optional_string(lesson.get("dueAt")),
        }

    activity_by_date = value.get("activityByDate", {})
    if not isinstance(activity_by_date, dict):
        raise ValueError("Activity by date must be an object.")
    normalized_activity: dict[str, dict[str, int]] = {}
    for date, activity in activity_by_date.items():
        if not isinstance(date, str) or not isinstance(activity, dict):
            raise ValueError("Each activity day must be an object.")
        normalized_activity[date] = {
            "attempts": non_negative_integer(activity.get("attempts", 0), "Day attempts"),
            "mastered": non_negative_integer(activity.get("mastered", 0), "Day mastery"),
        }

    recent_variants = string_list_map(value.get("recentVariants", {}))
    last_passes = normalize_last_passes(value.get("lastPasses", {}))
    active_session = value.get("activeSession")
    if active_session is not None and not isinstance(active_session, dict):
        raise ValueError("Active session must be an object or null.")
    legacy_pending = value.get("pendingCompletion")
    if legacy_pending is not None and not isinstance(legacy_pending, dict):
        raise ValueError("Pending completion must be an object or null.")
    pending_completions = normalize_pending_completions(
        value.get("pendingCompletions", {})
    )
    resolved_completions = normalize_resolved_completions(
        value.get("resolvedCompletions", {})
    )
    if isinstance(legacy_pending, dict) and legacy_pending.get("lessonId"):
        completion_id = legacy_pending.get("id") or (
            f"{legacy_pending.get('lessonId')}:"
            f"{legacy_pending.get('sequenceId')}:"
            f"{legacy_pending.get('completedAt')}"
        )
        pending_completions[completion_id] = {
            **legacy_pending,
            "id": completion_id,
        }
    elif isinstance(legacy_pending, dict) and legacy_pending.get("resolvedId"):
        resolved_at = optional_string(legacy_pending.get("resolvedAt"))
        if resolved_at:
            resolved_completions[legacy_pending["resolvedId"]] = resolved_at
    pending_completion, pending_completion_updated_at = reconcile_pending_completions(
        pending_completions, resolved_completions
    )
    active_session_updated_at = optional_string(
        value.get(
            "activeSessionUpdatedAt",
            active_session.get("updatedAt") if isinstance(active_session, dict) else None,
        )
    )
    baseline_value = value.get("baseline")
    if baseline_value is None:
        baseline = {
            "lessons": {
                lesson_id: contribution_from_lesson(lesson)
                for lesson_id, lesson in lessons.items()
            },
            "activityByDate": copy.deepcopy(normalized_activity),
        }
    elif isinstance(baseline_value, dict):
        baseline = normalize_contribution_set(baseline_value)
    else:
        raise ValueError("Baseline must be an object.")

    device_contributions = value.get("deviceContributions", {})
    if not isinstance(device_contributions, dict):
        raise ValueError("Device contributions must be an object.")
    normalized_contributions = {
        device_id: normalize_contribution_set(contribution)
        for device_id, contribution in device_contributions.items()
        if isinstance(device_id, str) and isinstance(contribution, dict)
    }

    history = {
        "version": 4,
        "lessons": lessons,
        "activeSession": active_session,
        "activeSessionUpdatedAt": active_session_updated_at,
        "pendingCompletion": pending_completion,
        "pendingCompletionUpdatedAt": pending_completion_updated_at,
        "pendingCompletions": pending_completions,
        "resolvedCompletions": resolved_completions,
        "recentVariants": recent_variants,
        "lastPasses": last_passes,
        "activityByDate": normalized_activity,
        "baseline": baseline,
        "deviceContributions": normalized_contributions,
    }
    recalculate_counters(history)
    return history


def non_negative_integer(value: object, label: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{label} must be a non-negative integer.")
    return value


def optional_string(value: object) -> str | None:
    if value is None or isinstance(value, str):
        return value
    raise ValueError("Timestamps must be strings or null.")


def string_list(value: object) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise ValueError("Expected a list of string identifiers.")
    return list(dict.fromkeys(value))


def string_list_map(value: object) -> dict[str, list[str]]:
    if not isinstance(value, dict):
        raise ValueError("Expected an object containing identifier lists.")
    return {
        key: string_list(items)
        for key, items in value.items()
        if isinstance(key, str)
    }


def normalize_last_passes(value: object) -> dict[str, dict[str, object]]:
    if not isinstance(value, dict):
        raise ValueError("Last passes must be an object.")
    normalized: dict[str, dict[str, object]] = {}
    for sequence_id, last_pass in value.items():
        if not isinstance(sequence_id, str) or not isinstance(last_pass, dict):
            raise ValueError("Each last pass must be a keyed object.")
        updated_at = optional_string(last_pass.get("updatedAt"))
        if updated_at is None:
            raise ValueError("Each last pass requires an updated timestamp.")
        normalized[sequence_id] = {
            "ids": string_list(last_pass.get("ids", [])),
            "updatedAt": updated_at,
        }
    return normalized


def normalize_pending_completions(value: object) -> dict[str, dict[str, object]]:
    if not isinstance(value, dict):
        raise ValueError("Pending completions must be an object.")
    normalized: dict[str, dict[str, object]] = {}
    for completion_id, completion in value.items():
        if (
            not isinstance(completion_id, str)
            or not isinstance(completion, dict)
            or not isinstance(completion.get("lessonId"), str)
            or not isinstance(completion.get("sequenceId"), str)
            or not isinstance(completion.get("completedAt"), str)
        ):
            raise ValueError("Each pending completion requires stable identifiers.")
        normalized[completion_id] = {**completion, "id": completion_id}
    return normalized


def normalize_resolved_completions(value: object) -> dict[str, str]:
    if not isinstance(value, dict):
        raise ValueError("Resolved completions must be an object.")
    if not all(
        isinstance(completion_id, str) and isinstance(timestamp, str)
        for completion_id, timestamp in value.items()
    ):
        raise ValueError("Resolved completions require identifier timestamps.")
    return dict(value)


def reconcile_pending_completions(
    pending: dict[str, dict[str, object]], resolved: dict[str, str]
) -> tuple[dict[str, object] | None, str | None]:
    for completion_id, completion in list(pending.items()):
        if resolved.get(completion_id, "") >= str(completion.get("completedAt") or ""):
            del pending[completion_id]
    current = max(
        pending.values(), key=lambda completion: str(completion["completedAt"]), default=None
    )
    timestamps = [
        *[str(completion["completedAt"]) for completion in pending.values()],
        *resolved.values(),
    ]
    return current, max(timestamps, default=None)


def contribution(value: object) -> dict[str, int]:
    if not isinstance(value, dict):
        raise ValueError("Contribution statistics must be an object.")
    return {
        "attempts": non_negative_integer(value.get("attempts", 0), "Contribution attempts"),
        "firstAttempts": non_negative_integer(
            value.get("firstAttempts", 0), "Contribution first attempts"
        ),
        "firstAttemptCorrect": non_negative_integer(
            value.get("firstAttemptCorrect", 0), "Contribution correct answers"
        ),
    }


def contribution_from_lesson(lesson: dict[str, object]) -> dict[str, int]:
    return {
        "attempts": int(lesson["attempts"]),
        "firstAttempts": int(lesson["firstAttempts"]),
        "firstAttemptCorrect": int(lesson["firstAttemptCorrect"]),
    }


def normalize_contribution_set(value: dict[str, object]) -> dict[str, object]:
    lessons = value.get("lessons", {})
    activity = value.get("activityByDate", {})
    if not isinstance(lessons, dict) or not isinstance(activity, dict):
        raise ValueError("Contribution sets must contain lesson and activity objects.")
    return {
        "lessons": {
            lesson_id: contribution(stats)
            for lesson_id, stats in lessons.items()
            if isinstance(lesson_id, str)
        },
        "activityByDate": {
            date: {
                "attempts": non_negative_integer(stats.get("attempts", 0), "Day attempts"),
                "mastered": non_negative_integer(stats.get("mastered", 0), "Day mastery"),
            }
            for date, stats in activity.items()
            if isinstance(date, str) and isinstance(stats, dict)
        },
    }


def recalculate_counters(history: dict[str, object]) -> None:
    lessons = history["lessons"]
    baseline = history["baseline"]
    contributions = history["deviceContributions"]
    lesson_ids = set(lessons) | set(baseline["lessons"])
    for device in contributions.values():
        lesson_ids.update(device["lessons"])
    for lesson_id in lesson_ids:
        if lesson_id not in lessons:
            lessons[lesson_id] = {
                "completedLearn": [],
                "masteredPractice": [],
                "learnedTargets": {},
                "masteredTargets": {},
                "lastPracticedAt": None,
                "dueAt": None,
            }
        totals = dict(
            baseline["lessons"].get(
                lesson_id,
                {"attempts": 0, "firstAttempts": 0, "firstAttemptCorrect": 0},
            )
        )
        for device in contributions.values():
            stats = device["lessons"].get(lesson_id)
            if stats:
                for key in totals:
                    totals[key] += stats[key]
        lessons[lesson_id].update(totals)

    dates = set(baseline["activityByDate"])
    for device in contributions.values():
        dates.update(device["activityByDate"])
    history["activityByDate"] = {}
    for date in dates:
        totals = dict(
            baseline["activityByDate"].get(date, {"attempts": 0, "mastered": 0})
        )
        for device in contributions.values():
            stats = device["activityByDate"].get(date)
            if stats:
                totals["attempts"] += stats["attempts"]
                totals["mastered"] += stats["mastered"]
        history["activityByDate"][date] = totals


def merge_string_lists(first: list[str], second: list[str]) -> list[str]:
    return list(dict.fromkeys([*first, *second]))


def merge_history(current: dict[str, object], incoming: dict[str, object]) -> dict[str, object]:
    merged = copy.deepcopy(current)
    for lesson_id, incoming_lesson in incoming["lessons"].items():
        if lesson_id not in merged["lessons"]:
            merged["lessons"][lesson_id] = copy.deepcopy(incoming_lesson)
            continue
        lesson = merged["lessons"][lesson_id]
        for field in ("completedLearn", "masteredPractice"):
            lesson[field] = merge_string_lists(lesson[field], incoming_lesson[field])
        for field in ("learnedTargets", "masteredTargets"):
            for sequence_id, targets in incoming_lesson[field].items():
                lesson[field][sequence_id] = merge_string_lists(
                    lesson[field].get(sequence_id, []), targets
                )
        if str(incoming_lesson.get("lastPracticedAt") or "") > str(
            lesson.get("lastPracticedAt") or ""
        ):
            lesson["lastPracticedAt"] = incoming_lesson["lastPracticedAt"]
            lesson["dueAt"] = incoming_lesson["dueAt"]

    for lesson_id, stats in incoming["baseline"]["lessons"].items():
        current_stats = merged["baseline"]["lessons"].setdefault(
            lesson_id, {"attempts": 0, "firstAttempts": 0, "firstAttemptCorrect": 0}
        )
        for key in current_stats:
            current_stats[key] = max(current_stats[key], stats[key])
    for date, stats in incoming["baseline"]["activityByDate"].items():
        current_stats = merged["baseline"]["activityByDate"].setdefault(
            date, {"attempts": 0, "mastered": 0}
        )
        for key in current_stats:
            current_stats[key] = max(current_stats[key], stats[key])

    for device_id, incoming_device in incoming["deviceContributions"].items():
        device = merged["deviceContributions"].setdefault(
            device_id, {"lessons": {}, "activityByDate": {}}
        )
        for lesson_id, stats in incoming_device["lessons"].items():
            current_stats = device["lessons"].setdefault(
                lesson_id,
                {"attempts": 0, "firstAttempts": 0, "firstAttemptCorrect": 0},
            )
            for key in current_stats:
                current_stats[key] = max(current_stats[key], stats[key])
        for date, stats in incoming_device["activityByDate"].items():
            current_stats = device["activityByDate"].setdefault(
                date, {"attempts": 0, "mastered": 0}
            )
            for key in current_stats:
                current_stats[key] = max(current_stats[key], stats[key])

    for sequence_id, variants in incoming["recentVariants"].items():
        merged["recentVariants"][sequence_id] = merge_string_lists(
            merged["recentVariants"].get(sequence_id, []), variants
        )[-100:]
    for sequence_id, last_pass in incoming["lastPasses"].items():
        current = merged["lastPasses"].get(sequence_id)
        if current is None or str(last_pass["updatedAt"]) > str(current["updatedAt"]):
            merged["lastPasses"][sequence_id] = copy.deepcopy(last_pass)
    if str(incoming.get("activeSessionUpdatedAt") or "") > str(
        merged.get("activeSessionUpdatedAt") or ""
    ):
        merged["activeSession"] = incoming["activeSession"]
        merged["activeSessionUpdatedAt"] = incoming["activeSessionUpdatedAt"]
    for completion_id, completion in incoming["pendingCompletions"].items():
        current = merged["pendingCompletions"].get(completion_id)
        if current is None or str(completion["completedAt"]) > str(
            current["completedAt"]
        ):
            merged["pendingCompletions"][completion_id] = copy.deepcopy(completion)
    for completion_id, resolved_at in incoming["resolvedCompletions"].items():
        merged["resolvedCompletions"][completion_id] = max(
            resolved_at, merged["resolvedCompletions"].get(completion_id, "")
        )
    (
        merged["pendingCompletion"],
        merged["pendingCompletionUpdatedAt"],
    ) = reconcile_pending_completions(
        merged["pendingCompletions"], merged["resolvedCompletions"]
    )
    recalculate_counters(merged)
    return merged


def migrate_version_two(value: dict[str, object]) -> dict[str, object]:
    legacy_lessons = value["lessons"]
    completed = value.get("completedStages", {})
    activity = value.get("activity", {})
    if not isinstance(legacy_lessons, dict) or not isinstance(completed, dict):
        raise ValueError("Version 2 history is invalid.")

    lessons: dict[str, dict[str, object]] = {}
    for lesson_id, legacy in legacy_lessons.items():
        if not isinstance(lesson_id, str) or not isinstance(legacy, dict):
            raise ValueError("Version 2 lesson history is invalid.")
        attempts = non_negative_integer(legacy.get("attempts", 0), "Lesson attempts")
        correct = non_negative_integer(legacy.get("correct", 0), "Lesson correct answers")
        lessons[lesson_id] = {
            "completedLearn": string_list(completed.get(lesson_id, [])),
            "masteredPractice": [],
            "learnedTargets": {},
            "masteredTargets": {},
            "attempts": attempts,
            "firstAttempts": attempts,
            "firstAttemptCorrect": min(correct, attempts),
            "lastPracticedAt": optional_string(legacy.get("lastPracticed")),
            "dueAt": None,
        }

    activity_days = activity.get("days", {}) if isinstance(activity, dict) else {}
    if not isinstance(activity_days, dict):
        raise ValueError("Version 2 activity history is invalid.")
    activity_by_date = {
        date: {
            "attempts": non_negative_integer(count, "Day attempts"),
            "mastered": 0,
        }
        for date, count in activity_days.items()
        if isinstance(date, str)
    }
    history = {
        "version": 4,
        "lessons": lessons,
        "activeSession": None,
        "activeSessionUpdatedAt": None,
        "pendingCompletion": None,
        "pendingCompletionUpdatedAt": None,
        "pendingCompletions": {},
        "resolvedCompletions": {},
        "recentVariants": {},
        "lastPasses": {},
        "activityByDate": activity_by_date,
        "baseline": {
            "lessons": {
                lesson_id: contribution_from_lesson(lesson)
                for lesson_id, lesson in lessons.items()
            },
            "activityByDate": copy.deepcopy(activity_by_date),
        },
        "deviceContributions": {},
    }
    return history


def load_history() -> tuple[dict[str, object], bool]:
    if not HISTORY_PATH.exists():
        return empty_history(), True
    try:
        raw_history = json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
        return normalize_history(raw_history), True
    except UnsupportedHistoryVersion as error:
        print(f"History is read-only until the app is updated: {error}")
        return raw_history, False
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"Could not load {HISTORY_PATH}: {error}")
        return empty_history(), True


def save_history(history: dict[str, object]) -> None:
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = HISTORY_PATH.with_suffix(".tmp")
    temporary_path.write_text(
        json.dumps(history, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary_path.replace(HISTORY_PATH)


class LessonServer(ThreadingHTTPServer):
    lesson_history: dict[str, object]
    history_lock: threading.Lock
    history_writable: bool


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
        if not self.server.history_writable:
            self.send_error(
                HTTPStatus.CONFLICT,
                "History was created by a newer app version and is read-only.",
            )
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

        with self.server.history_lock:
            history = merge_history(self.server.lesson_history, history)
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
    server.history_lock = threading.Lock()
    server.lesson_history, server.history_writable = load_history()
    print(f"Listening on port {arguments.port} at http://{arguments.bind}:{arguments.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
