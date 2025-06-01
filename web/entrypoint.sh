#!/bin/sh
set -e

CERT_PATH="/etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem"
NGINX_CONF_DIR="/etc/nginx/conf.d"

if [ ! -f "$CERT_PATH" ]; then
    echo "No hay certificado. Usando configuración temporal HTTP..."
    cp /etc/nginx/http-only.conf $NGINX_CONF_DIR/default.conf
else
    echo "Certificado encontrado. Usando configuración HTTPS..."
    cp /etc/nginx/default.conf $NGINX_CONF_DIR/default.conf
fi

echo "Iniciando NGINX..."
nginx &

if [ ! -f "$CERT_PATH" ]; then
    echo "Esperando a que Certbot genere el certificado..."
    while [ ! -f "$CERT_PATH" ]; do
        sleep 5
    done
    echo "Certificado generado. Activando HTTPS..."

    cp /etc/nginx/default.conf $NGINX_CONF_DIR/default.conf
    nginx -s reload
fi

tail -f /var/log/nginx/access.log
