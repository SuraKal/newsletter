"""Passenger entry point for the complete Nekedem application.

Set the cPanel Python application's root to the FTP_SERVER_DIR deployment
folder. Flask then serves both `/api/v1/*` and the compiled React application.
"""
import os
import sys


PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")

for path in (BACKEND_DIR, PROJECT_ROOT):
    if path not in sys.path:
        sys.path.insert(0, path)

from backend.wsgi import app as application  # noqa: E402
