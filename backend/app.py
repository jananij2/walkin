"""Walkin — Flask API."""

import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

import ai as walkin_ai
from models import init_db

load_dotenv()

app = Flask(__name__, static_folder=None)
CORS(app, resources={r"/api/*": {"origins": "*"}})

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


# ---------------------------------------------------------------------------
# Lookbook generation
# ---------------------------------------------------------------------------

@app.post("/api/lookbook/generate")
def lookbook_generate():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Invalid request body."}), 400

    closet_items = body.get("closetItems")
    inspo_tags = body.get("inspoTags", [])

    if not isinstance(closet_items, list) or not closet_items:
        return jsonify({"error": "closetItems must be a non-empty array."}), 400

    try:
        result = walkin_ai.generate_lookbook(closet_items, inspo_tags)
        return jsonify(result)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


# ---------------------------------------------------------------------------
# SPA fallback — serves frontend/dist in production (Docker build)
# ---------------------------------------------------------------------------

@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def spa_fallback(path: str):
    if not FRONTEND_DIST.exists():
        return jsonify({"error": "Frontend dist not present. Run `npm run build` in frontend/."}), 404
    target = FRONTEND_DIST / path
    if path and target.is_file():
        return send_from_directory(str(FRONTEND_DIST), path)
    return send_from_directory(str(FRONTEND_DIST), "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
