# DevOps Practical Exercise

This is a minimal Node.js API example.

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
