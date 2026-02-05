#!/bin/bash

# Function to check if .env exists, if not copy from .env.example
function check_env {
    if [ ! -f .env ]; then
        echo "Creating .env file from .env.example..."
        cp .env.example .env
    else
        echo ".env file already exists."
    fi
}

function show_help {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build             Rebuild Docker images"
    echo "  start             Start the entire stack (Client, Server, DB, ES)"
    echo "  stop              Stop the entire stack (Client, Server, DB, ES)"
    echo "  lint              Run linting."
    echo "  tsr:generate      Generate Tanstack Router routes"
    echo "  db:generate       Generate Drizzle migrations"
    echo "  db:migrate        Apply Drizzle migrations"
    echo "  db:push           Push schema changes to DB directly"
    echo "  db:check          Check for schema deviations"
}

if [ -z "$1" ]; then
    show_help
    exit 1
fi

case "$1" in
    build)
        check_env
        docker compose build
        ;;
    start)
        if ! docker info > /dev/null 2>&1; then
            echo "Error: Docker daemon is not running or not accessible."
            exit 1
        fi
        check_env
        echo "Starting stack in detached mode..."
        docker compose up -d

        echo "Waiting for Postgres to be ready..."
        # Wait until pg_isready returns 0
        until docker compose exec postgres pg_isready -U postgres; do
            echo "Waiting for database..."
            sleep 2
        done

        echo "Database is ready."

        echo "Generating Drizzle migrations..."
        docker compose exec server pnpm --filter @repo/server db:generate

        echo "Applying Drizzle migrations..."
        docker compose exec server pnpm --filter @repo/server db:migrate

        echo "Generating Tanstack Router routes..."
        docker compose exec client pnpm --filter @repo/client generate

        # Trap Ctrl+C (SIGINT) to run docker compose down
        trap "echo 'Stopping stack...'; docker compose down; exit" SIGINT

        echo "Tailing logs... (Press Ctrl+C to stop the stack)"
        docker compose logs -f
        ;;
    stop)
        docker compose down
        docker system prune -f --volumes
        ;;
    lint)
        echo "Linting entire monorepo..."
        docker compose up server -d
        docker compose exec server pnpm lint
        ;;
    tsr:generate)
        echo "Generating Tanstack Router routes..."
        docker compose up client -d
        docker compose exec client pnpm --filter @repo/client generate
        ;;
    db:generate)
        docker compose up server postgres -d
        docker compose exec server pnpm --filter @repo/server db:generate
        ;;
    db:migrate)
        docker compose up server postgres -d
        docker compose exec server pnpm --filter @repo/server db:migrate
        ;;
    db:push)
        docker compose up server postgres -d
        docker compose exec server pnpm --filter @repo/server db:push
        ;;
    db:check)
        docker compose up server postgres -d
        docker compose exec server pnpm --filter @repo/server db:check
        ;;
    help)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
