FROM nginx:stable-alpine

RUN apk add --no-cache openssl

COPY --from=frontend /app/dist /usr/share/nginx/html

RUN mkdir -p /etc/nginx/certs

COPY default.conf /etc/nginx/conf.d/default.conf