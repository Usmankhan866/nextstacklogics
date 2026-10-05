from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
import os
import logging
import smtplib
import json
import threading
import urllib.request
import urllib.error
from email.message import EmailMessage
from pathlib import Path
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection. A synchronous client is used on purpose: it is not tied to an
# event loop, so it behaves the same under uvicorn locally and in Vercel's serverless runtime.
client = MongoClient(os.environ['MONGO_URL'], serverSelectionTimeoutMS=8000)
db = client[os.environ['DB_NAME']]

_indexes_ready = False
_indexes_lock = threading.Lock()


def ensure_indexes() -> None:
    """Create the unique email index once per process (serverless has no reliable startup hook)."""
    global _indexes_ready
    if _indexes_ready:
        return
    with _indexes_lock:
        if not _indexes_ready:
            db.waitlist.create_index("email", unique=True)
            _indexes_ready = True


# New-signup notification email (optional: skipped when SMTP settings are missing)
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '').replace(' ', '')
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', '')
# Alternative to Gmail SMTP: a Resend API key (https://resend.com). Used first when set.
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
RESEND_FROM = os.environ.get('RESEND_FROM', 'NexStack Website <onboarding@resend.dev>')


def send_signup_notification(email: str, position: int, signed_up_at: str) -> None:
    """Email the team about a new waitlist signup. Runs after the response is sent."""
    log = logging.getLogger(__name__)
    subject = f"New waitlist signup #{position}: {email}"
    body = (
        "Someone just joined the NexStack Logics waitlist.\n\n"
        f"Email:     {email}\n"
        f"Position:  #{position}\n"
        f"Time (UTC): {signed_up_at}\n"
    )
    if not NOTIFY_EMAIL:
        log.info("Signup notification skipped: NOTIFY_EMAIL not set")
        return
    if RESEND_API_KEY:
        payload = json.dumps({
            "from": RESEND_FROM,
            "to": [NOTIFY_EMAIL],
            "reply_to": email,
            "subject": subject,
            "text": body,
        }).encode()
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=payload,
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "nexstack-backend/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                log.info("Signup notification sent via Resend for %s (HTTP %s)", email, resp.status)
        except urllib.error.HTTPError as e:
            log.error("Resend rejected signup notification: HTTP %s %s", e.code, e.read().decode(errors="replace"))
        except Exception:
            log.exception("Failed to send signup notification via Resend for %s", email)
        return
    if not (SMTP_USER and SMTP_PASSWORD):
        log.info("Signup notification skipped: no RESEND_API_KEY or SMTP password configured")
        return
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = f"NexStack Website <{SMTP_USER}>"
    msg['To'] = NOTIFY_EMAIL
    msg['Reply-To'] = email
    msg.set_content(body)
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        log.info("Signup notification sent via Gmail SMTP for %s", email)
    except Exception:
        log.exception("Failed to send signup notification via Gmail SMTP for %s", email)


app = FastAPI()
api_router = APIRouter(prefix="/api")


class SubscribeRequest(BaseModel):
    email: EmailStr


ALREADY_REGISTERED = {
    "success": True,
    "already_registered": True,
    "message": "You're already on the list — we'll email you the moment we launch.",
}


# Endpoints are plain `def`: FastAPI runs them in a worker thread, so blocking
# database and SMTP calls never stall the server.
@api_router.get("/")
def root():
    return {"message": "Hello World"}

@api_router.post("/subscribe")
def subscribe(request: SubscribeRequest):
    email = request.email.strip().lower()
    doc = {
        "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        ensure_indexes()
        if db.waitlist.find_one({"email": email}):
            return ALREADY_REGISTERED
        try:
            db.waitlist.insert_one(doc)
        except DuplicateKeyError:
            return ALREADY_REGISTERED
        position = db.waitlist.count_documents({})
    except PyMongoError:
        logger.exception("Database error during subscribe")
        raise HTTPException(status_code=503, detail="We couldn't save your email right now. Please try again in a minute.")

    # Sent before responding: serverless functions may be frozen once the response is out.
    send_signup_notification(email, position, doc["created_at"])

    return {
        "success": True,
        "already_registered": False,
        "position": position,
        "message": f"You're #{position} on the list — we'll email you the moment we launch.",
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
