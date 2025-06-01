FROM nginx:stable-alpine

RUN apk add --no-cache openssl

COPY --from=frontend /app/dist /usr/share/nginx/html

RUN mkdir -p /etc/nginx/certs

COPY default.conf /etc/nginx/default.conf
COPY http-only.conf /etc/nginx/http-only.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
