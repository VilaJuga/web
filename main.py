## admin.vilajuga.cat

import json
import os
import secrets
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException, Request as FastAPIRequest
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
import dotenv
dotenv.load_dotenv()


app = FastAPI()

SESSION_SECRET = os.getenv("SESSION_SECRET", "change-me-in-production")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/auth/github/callback")

app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET, same_site="lax", https_only=False)


def _require_oauth_config() -> None:
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Missing GitHub OAuth configuration. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.",
        )


def _post_form_json(url: str, data: dict[str, str], headers: dict[str, str]) -> dict:
    encoded = urlencode(data).encode("utf-8")
    request = Request(url, data=encoded, method="POST", headers=headers)
    with urlopen(request, timeout=15) as response:
        body = response.read().decode("utf-8")
    return json.loads(body)


def _get_json(url: str, headers: dict[str, str]) -> dict:
    request = Request(url, method="GET", headers=headers)
    with urlopen(request, timeout=15) as response:
        body = response.read().decode("utf-8")
    return json.loads(body)

@app.get("/")
async def root():
    return RedirectResponse(url="https://vilajuga.org")


@app.get("/login/github")
async def login_github(request: FastAPIRequest):
    _require_oauth_config()

    state = secrets.token_urlsafe(32)
    request.session["oauth_state"] = state

    query = urlencode(
        {
            "client_id": GITHUB_CLIENT_ID,
            "redirect_uri": GITHUB_REDIRECT_URI,
            "scope": "read:user user:email",
            "state": state,
        }
    )
    return RedirectResponse(url=f"https://github.com/login/oauth/authorize?{query}")


@app.get("/auth/github/callback")
async def github_callback(request: FastAPIRequest, code: str | None = None, state: str | None = None):
    _require_oauth_config()

    expected_state = request.session.get("oauth_state")
    if not expected_state or not state or expected_state != state:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    if not code:
        raise HTTPException(status_code=400, detail="Missing OAuth code")

    token_payload = _post_form_json(
        "https://github.com/login/oauth/access_token",
        {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": GITHUB_REDIRECT_URI,
            "state": state,
        },
        {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "vilajuga-admin-oauth",
        },
    )

    access_token = token_payload.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="OAuth token exchange failed")

    user = _get_json(
        "https://api.github.com/user",
        {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {access_token}",
            "User-Agent": "vilajuga-admin-oauth",
        },
    )

    request.session["github_user"] = {
        "id": user.get("id"),
        "login": user.get("login"),
        "name": user.get("name"),
        "avatar_url": user.get("avatar_url"),
    }
    request.session.pop("oauth_state", None)

    return RedirectResponse(url="/admin")

@app.get("/admin")
async def admin(request: FastAPIRequest):
    user = request.session.get("github_user")
    if not user:
        return RedirectResponse(url="/login/github")

    return JSONResponse(
        {
            "message": "Authenticated admin session",
            "provider": "github",
            "user": user,
        }
    )


@app.get("/logout")
async def logout(request: FastAPIRequest):
    request.session.clear()
    return RedirectResponse(url="/")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)