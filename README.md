# DevOps Practical Exercise

This is a minimal Node.js API example.

## Table of Contents

- [Requirements](#requirements)
- [Run Locally](#run-locally)
- [Endpoints](#endpoints)
- [Run With Docker](#run-with-docker)
- [Continuous Integration](#continuous-integration)
- [Operational Health Check](#operational-health-check)

## Requirements

- Node.js 20 or newer
- npm

## Run Locally

Install dependencies:

```bash
npm install
```

Run the API with environment variables:

```bash
APP_VERSION=1.0.0 PORT=3000 npm start
```

You can also create a local `.env` file from `.env.example` and run:

```bash
npm start
```

By default, the API runs at:

```text
http://localhost:3000
```

## Endpoints

Health check:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

Version:

```bash
curl http://localhost:3000/version
```

Expected response:

```json
{ "version": "1.0.0" }
```

## Run With Docker

Build the image:

```bash
docker build -t devops-api:1.0.0 .
```

Run the container:

```bash
docker run --rm -p 3000:3000 -e APP_VERSION=1.0.0 devops-api:1.0.0
```

Verify the container:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/version
```

## Continuous Integration

GitHub Actions runs on pushes and pull requests targeting `develop` and `main`.

The CI workflow installs dependencies, runs ESLint, executes automated tests for `/health` and `/version`, and builds the Docker image.

NOTE: On push events to `develop` or `main`, the workflow also publishes the image to GHCR with branch and commit-based tags.

## Operational Health Check

The repository includes a Python health-check script that checks `GET /health`, appends the result to a local log file, and returns a non-zero exit code when the service is unreachable or does not return HTTP 200.

Before running the script, build the Docker image and start the API container:

```bash
docker build -t devops-api:1.0.0 .
docker run --rm -d -p 3000:3000 -e APP_VERSION=1.0.0 devops-api:1.0.0
```

Run the health-check from another terminal:

```bash
python scripts/healthcheck.py --host localhost --port 3000
```

The script also supports environment variables:

```bash
HEALTHCHECK_HOST=localhost HEALTHCHECK_PORT=3000 HEALTHCHECK_LOG_FILE=healthcheck.log python scripts/healthcheck.py
```

Example log output:

```text
2026-06-28T18:30:00Z OK http://localhost:3000/health status=200
2026-06-28T18:31:00Z ERROR http://localhost:3000/health service_unreachable
```

The generated `.log` file is an execution artifact and must not be committed.
