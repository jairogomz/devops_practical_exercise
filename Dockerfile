# Node and Alpine versions.
FROM node:20.19.4-alpine3.22 AS base
WORKDIR /app

# Install production dependencies in a separate stage to keep Docker cache useful.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Final image: only runtime files and production dependencies.
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Run the application as a non-root user.
RUN addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 --ingroup appgroup appuser

# Copy files with the final owner.
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package.json ./
COPY --chown=appuser:appgroup src ./src

USER appuser

EXPOSE 3000

# Start Node.
CMD ["node", "src/server.js"]
