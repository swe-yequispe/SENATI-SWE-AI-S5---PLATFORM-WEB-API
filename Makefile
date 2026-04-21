.PHONY: help install dev test build docker-up docker-down docker-logs docker-dev-up docker-dev-down docker-dev-logs

help:
	@echo "Targets disponibles:"
	@echo "  install           Instala dependencias"
	@echo "  dev               Levanta frontend+backend en local"
	@echo "  test              Ejecuta tests de backend y frontend"
	@echo "  build             Compila shared, backend y frontend"
	@echo "  docker-up         Levanta stack Docker de despliegue"
	@echo "  docker-down       Detiene stack Docker de despliegue"
	@echo "  docker-logs       Logs stack Docker de despliegue"
	@echo "  docker-dev-up     Levanta stack Docker de desarrollo (hot reload)"
	@echo "  docker-dev-down   Detiene stack Docker de desarrollo"
	@echo "  docker-dev-logs   Logs stack Docker de desarrollo"

install:
	npm install

dev:
	npm run dev

test:
	npm run test

build:
	npm run build

docker-up:
	npm run docker:up

docker-down:
	npm run docker:down

docker-logs:
	npm run docker:logs

docker-dev-up:
	npm run docker:dev:up

docker-dev-down:
	npm run docker:dev:down

docker-dev-logs:
	npm run docker:dev:logs
