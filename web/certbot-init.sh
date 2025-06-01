#!/bin/sh

sleep 15

CERT_PATH="/etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem"

# Delete auto-signed certificate
if openssl x509 -in "$CERT_PATH" -noout -subject 2>/dev/null | grep -q 'CN=localhost'; then
  echo "Certificado auto-signed detectado. Eliminando..."
  rm -rf /etc/letsencrypt/live/stacks-gg.duckdns.org
  rm -rf /etc/letsencrypt/archive/stacks-gg.duckdns.org
  rm -f /etc/letsencrypt/renewal/stacks-gg.duckdns.org.conf
fi

# Get real certificate
if ! grep -q "Let's Encrypt" "$CERT_PATH" 2>/dev/null; then
  echo "Ejecutando Certbot para obtener certificado real..."
  certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email jaimelozanolozano12@gmail.com --agree-tos --no-eff-email \
    -d stacks-gg.duckdns.org
else
  echo "Certificado válido ya presente. Omitiendo Certbot."
fi
