#!/bin/sh
set -e

# Check if the certificate already exists
if [ ! -f /etc/nginx/certs/selfsigned.crt ]; then
    echo "Generando certificado autofirmado..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -subj "/C=ES/ST=Granada/L=Granada/O=STACKS/OU=TECH/CN=Jaime Lozano Lozano/emailAddress=jaimelozanlozano12@gmail.com" \
        -keyout /etc/nginx/certs/selfsigned.key \
        -out /etc/nginx/certs/selfsigned.crt
fi

# Run Nginx in foreground
exec nginx -g "daemon off;"