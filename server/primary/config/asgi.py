"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from supports.routing import websocket_url_patterns
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

http_asgi_app = get_asgi_application()
# application = ProtocolTypeRouter(``
#     {
#         "http":http_asgi_app,
#         "webscoket":
#             AuthMiddlewareStack(URLRouter(websocket_url_patterns))
        
#     }
# )
application = ProtocolTypeRouter(
    {
        "http":get_asgi_application(),
        "websocket":AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_url_patterns))
        )
    }
)
