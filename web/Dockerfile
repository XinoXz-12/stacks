FROM nginx:stable-alpine

COPY --from=frontend-builder /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf
