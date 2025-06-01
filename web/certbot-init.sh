#!/bin/sh

sleep 15

if ! grep -q "Let's Encrypt" /etc/letsencrypt/live/stacks-gg.duckdns.org/fullchain.pem 2>/dev/null; then
  echo "🔄 Ejecutando Certbot para obtener certificado real..."
  certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email jaimelozanolozano12@gmail.com --agree-tos --no-eff-email \
    -d stacks-gg.duckdns.org
else
  echo "✅ Certificado válido ya presente. Omitiendo Certbot."
fi
