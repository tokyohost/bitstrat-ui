FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# 前端打包产物
COPY dist/ ./

COPY nginx.conf /etc/nginx/nginx.conf

# runtime env 模板
COPY public/env.template.js .

# nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 容器启动时注入 env
CMD ["/bin/sh", "-c", "\
  envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js && \
  nginx -g 'daemon off;'"]
EXPOSE 80
