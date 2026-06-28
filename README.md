# DevOps Practical Exercise

This is a minimal Node.js API example.

## Table of Contents

- [1. Base Application and Repository](#1-base-application-and-repository)
  - [1.1 Requirements](#11-requirements)
  - [1.2 Run Locally](#12-run-locally)
  - [1.3 Endpoints](#13-endpoints)
- [2. Docker Containerization](#2-docker-containerization)
  - [2.1 Run With Docker](#21-run-with-docker)
- [3. Continuous Integration](#3-continuous-integration)
  - [3.1 CI Pipeline](#31-ci-pipeline)
- [4. Operational Automation](#4-operational-automation)
  - [4.1 Operational Health Check](#41-operational-health-check)
- [5. Security and Repository Controls](#5-security-and-repository-controls)
  - [5.1 Repository Governance](#51-repository-governance)
  - [5.2 Secrets Management](#52-secrets-management)

## 1. Base Application and Repository

### 1.1 Requirements

- Node.js 20 or newer
- npm

### 1.2 Run Locally

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

### 1.3 Endpoints

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

## 2. Docker Containerization

### 2.1 Run With Docker

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

## 3. Continuous Integration

### 3.1 CI Pipeline

GitHub Actions runs on pushes and pull requests targeting `develop` and `main`.

The CI workflow installs dependencies, runs ESLint, executes automated tests for `/health` and `/version`, and builds the Docker image.

NOTE: On push events to `develop` or `main`, the workflow also publishes the image to GHCR with branch and commit-based tags.

## 4. Operational Automation

### 4.1 Operational Health Check

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

## 5. Security and Repository Controls

### 5.1 Repository Governance

Branch protection was configured for `develop` and `main`.

Protected branches require pull requests, passing status checks, resolved conversations, and no bypass of the configured rules before merging.

### 5.2 Secrets Management

Secrets must not be stored in source code, `.env.example`, Dockerfiles, or workflow logs. For CI, sensitive values should be configured in GitHub Secrets and injected only at runtime.

Example secret used by the workflow:

```text
DEMO_API_KEY
```

The demo secret was configured through GitHub Environments for both integration branches:

```text
Settings > Environments > develop > Environment secrets
Settings > Environments > main > Environment secrets
```

The CI job selects the matching environment based on the target branch, and references the secret as:

```yaml
DEMO_API_KEY: ${{ secrets.DEMO_API_KEY }}
```

The workflow only validates whether the secret is available and never prints its value.
