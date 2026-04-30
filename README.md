# DevOps Production Deployment Pipeline

Production-style DevOps project demonstrating end-to-end CI/CD, containerization, reverse proxying, and observability on AWS.

## Project Overview

This repository provides a practical baseline for deploying a Dockerized web app to AWS EC2 with automated CI/CD and a monitoring/logging stack.

## Architecture Diagram

```text
Developer Push
    |
 GitHub Repository
    |
 GitHub Actions CI/CD
    |
 Build & Push Docker Image
    |
 Deploy to AWS EC2
    |
 docker-compose up
    |
+---------+      +-----------+
|  Nginx  | ---> |    App    |
+---------+      +-----------+
      |                |
      +--------+-------+
               |
      +---------------------+
      | Monitoring & Logs   |
      | Prometheus/Grafana  |
      | Loki + Promtail     |
      +---------------------+
```

## Tech Stack

- **Cloud**: AWS EC2
- **Containers**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Web Proxy**: Nginx
- **Monitoring**: Prometheus, Grafana
- **Logging**: Loki, Promtail
- **App**: Python Flask

## Repository Structure

```text
project/
 ├── app/
 ├── Dockerfile
 ├── docker-compose.yml
 ├── nginx/
 ├── .github/workflows/deploy.yml
 ├── prometheus/
 ├── grafana/
 └── README.md
```

> Note: In this repo, `project/` is the repository root.

## CI/CD Flow

1. Push code to `main`.
2. GitHub Actions builds Docker image and pushes to Docker Hub.
3. Workflow connects to EC2 through SSH.
4. EC2 pulls latest image and restarts services with Docker Compose.
5. Prometheus scrapes metrics; Grafana dashboards visualize health.

## Deployment Steps

### 1) Create AWS EC2 instance

- Ubuntu 22.04 LTS
- Open ports: `22`, `80`, `3000`, `9090`, `3100`

### 2) Install runtime on EC2

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

### 3) Configure GitHub Secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`

### 4) Copy compose + configs to EC2

Place this repository on EC2 at `/opt/devops-pipeline`.

### 5) Trigger deployment

Push to `main` branch.

## Screenshots

Add screenshots after first deployment:

- GitHub Actions successful run
- App home page via Nginx (`http://EC2_PUBLIC_IP`)
- Grafana dashboard (`http://EC2_PUBLIC_IP:3000`)
- Prometheus targets (`http://EC2_PUBLIC_IP:9090/targets`)

## Suggested Resume Line

> Deployed a production-ready DevOps pipeline on AWS with CI/CD, Docker, Nginx, and monitoring stack (Prometheus + Grafana + Loki), with automated deployment and centralized logging.

