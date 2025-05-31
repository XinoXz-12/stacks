FROM nginx:stable-alpine

COPY --from=frontend /app/dist /usr/share/nginx/html

RUN mkdir -p /etc/nginx/certs

# Copia la configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia el script de entrypoint y le da permisos de ejecución
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Define el script de entrada como comando predeterminado
CMD ["/entrypoint.sh"]
