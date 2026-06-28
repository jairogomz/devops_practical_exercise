#!/usr/bin/env python3
import argparse
import os
import sys
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


def write_log(log_file, level, url, message):
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(log_file, "a", encoding="utf-8") as file:
        file.write(f"{timestamp} {level} {url} {message}\n")


def parse_args():
    parser = argparse.ArgumentParser(description="Run an HTTP health-check against the API.")
    # Arguments take priority, then environment variables, then local defaults.
    parser.add_argument("--host", default=os.getenv("HEALTHCHECK_HOST", "localhost"))
    parser.add_argument("--port", default=os.getenv("HEALTHCHECK_PORT", "3000"))
    parser.add_argument("--log-file", default=os.getenv("HEALTHCHECK_LOG_FILE", "healthcheck.log"))
    return parser.parse_args()


def main():
    args = parse_args()
    url = f"http://{args.host}:{args.port}/health"

    try:
        # Timeout prevents the script from hanging when the service is down.
        with urlopen(url, timeout=5) as response:
            status = response.status
    except HTTPError as error:
        write_log(args.log_file, "ERROR", url, f"status={error.code}")
        return 1
    except URLError:
        write_log(args.log_file, "ERROR", url, "service_unreachable")
        return 1
    except TimeoutError:
        write_log(args.log_file, "ERROR", url, "request_timeout")
        return 1

    if status != 200:
        write_log(args.log_file, "ERROR", url, f"status={status}")
        return 1

    write_log(args.log_file, "OK", url, f"status={status}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
