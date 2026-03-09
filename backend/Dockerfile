FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

EXPOSE 8000

CMD uv run gunicorn main:app --preload --worker-class uvicorn.workers.UvicornWorker --workers 4 --bind 0.0.0.0:${PORT:-8000}
