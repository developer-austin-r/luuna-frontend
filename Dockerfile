FROM node:24-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# NEXT_PUBLIC_* values are embedded in client-side JavaScript by `next build`.
# They must therefore be supplied while building the image, not only when the
# container starts via docker-compose's `env_file`.
ARG APP_ENV=production
ARG NEXT_PUBLIC_API_BASE_URL
ENV APP_ENV=${APP_ENV}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN test -n "$NEXT_PUBLIC_API_BASE_URL"
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
