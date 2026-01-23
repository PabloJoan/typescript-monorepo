#!/bin/bash

function show_help {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build             Rebuild Docker images"
    echo "  start             Start the entire stack (Client, Server, DB, ES)"
    echo "  stop              Stop the entire stack (Client, Server, DB, ES)"
    echo "  lint              Run linting."
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
        docker compose build
        ;;
    start)
        docker compose up
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
