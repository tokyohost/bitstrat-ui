FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# 前端打包产物
COPY dist/ ./

# runtime env 模板
COPY public/env.template.js .

# nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 容器启动时注入 env
CMD ["/bin/sh", "-c", "\
  envsubst < env.template.js > env.js && \
  nginx -g 'daemon off;'"]
