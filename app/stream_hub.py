"""In-memory hub for latest JPEG frames from field phone cameras."""

from threading import Lock
from time import time

_lock = Lock()
_frames: dict[int, dict] = {}


def put_frame(camera_id: int, jpeg_bytes: bytes, officer_id=None, session_token=None) -> None:
    with _lock:
        _frames[int(camera_id)] = {
            "jpeg": jpeg_bytes,
            "ts": time(),
            "officer_id": officer_id,
            "session_token": session_token,
        }


def get_frame(camera_id: int):
    with _lock:
        return _frames.get(int(camera_id))


def clear_frame(camera_id: int) -> None:
    with _lock:
        _frames.pop(int(camera_id), None)


def list_live(max_age: float = 8.0) -> list[int]:
    now = time()
    with _lock:
        return [cid for cid, frame in _frames.items() if now - frame["ts"] < max_age]


def is_fresh(camera_id: int, max_age: float = 8.0) -> bool:
    frame = get_frame(camera_id)
    return bool(frame and time() - frame["ts"] < max_age)
