#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem"

if [ ! -f "$CERT_PATH" ]; then
    echo "No hay certificado, generando dummy..."
    mkdir -p /etc/letsencrypt/live/stacks-gg.duckdns.org
    openssl req -x509 -nodes -newkey rsa:2048 \
        -days 1 \
        -keyout /etc/letsencrypt/live/stacks-gg.duckdns.org/privkey.pem \
        -out /etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem \
        -subj "/CN=localhost"
fi

echo "Iniciando NGINX..."
nginx -g "daemon off;"
