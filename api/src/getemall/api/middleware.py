"""Identifiant de requête, journal d'accès et en-têtes de sécurité.

Le journal utilise le modèle de route (/api/v1/lecons/{id}), jamais l'URL réelle ni la chaîne
de requête : aucune donnée dans les journaux (J-1, X-5).
"""

import logging
import re
import time
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from getemall.log import get_logger

log = get_logger("getemall.access")

REQUEST_ID_HEADER = "X-Request-ID"
QUIET_PATHS = frozenset({"/healthz", "/readyz"})
_VALID_REQUEST_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")
# L'API ne sert que du JSON : aucune ressource à charger, jamais dans un cadre (E-4).
SECURITY_HEADERS = {
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
}


def _route_template(request: Request) -> str:
    path = getattr(request.scope.get("route"), "path", None)
    return path if isinstance(path, str) else "unmatched"


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        incoming = request.headers.get(REQUEST_ID_HEADER, "")
        request_id = incoming if _VALID_REQUEST_ID.match(incoming) else uuid.uuid4().hex
        started = time.perf_counter()
        with structlog.contextvars.bound_contextvars(request_id=request_id):
            status = 500
            try:
                response = await call_next(request)
                status = response.status_code
            finally:
                level = logging.DEBUG if request.url.path in QUIET_PATHS else logging.INFO
                log.log(
                    level,
                    "http_request",
                    method=request.method,
                    route=_route_template(request),
                    status=status,
                    duration_ms=round((time.perf_counter() - started) * 1000, 1),
                )
        response.headers[REQUEST_ID_HEADER] = request_id
        for name, value in SECURITY_HEADERS.items():
            response.headers.setdefault(name, value)
        # Les réponses de l'API portent des données personnelles : jamais en cache (X-6).
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response
