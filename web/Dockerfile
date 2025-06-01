FROM nginx:stable

# Copy default config
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy your entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
