#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem"

if [ ! -f "$CERT_PATH" ]; then
    echo "No hay certificado, generando temporalmente un auto-signed..."
    mkdir -p /etc/letsencrypt/live/stacks-gg.duckdns.org
    openssl req -x509 -nodes -newkey rsa:2048 \
        -days 1 \
        -keyout /etc/letsencrypt/live/stacks-gg.duckdns.org/privkey.pem \
        -out /etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem \
        -subj "/CN=localhost"
else
    echo "Certificado encontrado, usando certificado Let's Encrypt..."
fi

echo "Iniciando NGINX..."
nginx -g "daemon off;"

(
  echo "Esperando a los certificados Let's Encrypt..."

  while true; do
    if [ -s "$CERT_PATH" ] && grep -q "BEGIN CERTIFICATE" "$CERT_PATH"; then
      echo "Certificados Let's Encrypt detectados. Recargando NGINX..."
      nginx -s reload
      break
    fi
    sleep 5
  done
) &

wait -n