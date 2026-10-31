FROM oven/bun:1-alpine
WORKDIR /app
COPY index.html ./index.html
COPY server.ts ./server.ts
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "server.ts"]
