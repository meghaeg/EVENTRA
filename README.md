EVENTRA – Automated CI/CD Pipeline with Kubernetes, Terraform & Monitoring

EVENTRA is a full-stack MERN application deployed using a complete DevOps pipeline that automates build, containerization, deployment, and monitoring. The project demonstrates real-world implementation of CI/CD using Jenkins, Docker, Terraform, and Kubernetes, along with observability using Prometheus and Grafana.

---

PROJECT OVERVIEW

This project automates the entire lifecycle of an application:

• Code is pushed to GitHub
• Jenkins triggers the pipeline
• Docker builds and pushes the image
• Terraform provisions infrastructure
• Kubernetes deploys the application
• Prometheus collects metrics
• Grafana visualizes system performance

The system ensures scalability, reliability, and zero manual deployment effort.

---

TECH STACK

Frontend: React.js
Backend: Node.js + Express.js
Database: MongoDB

DevOps Tools:
• Jenkins (CI/CD Automation)
• Docker (Containerization)
• Docker Hub (Image Registry)
• Terraform (Infrastructure as Code)
• Kubernetes (Container Orchestration)
• Prometheus (Monitoring)
• Grafana (Visualization)

---

PROJECT STRUCTURE

EVENTRA/
│
├── client/                  → React frontend
├── server/                  → Node.js backend
├── k8s/                     → Kubernetes YAML files
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── servicemonitor.yaml
│
├── terraform/               → Terraform configs
│   ├── main.tf
│
├── Dockerfile               → Multi-stage Docker build
├── Jenkinsfile              → CI/CD pipeline
└── package.json

---

WORKFLOW (STEP-BY-STEP)

1. Developer pushes code to GitHub
2. Jenkins pipeline is triggered
3. Jenkins builds Docker image (multi-stage build)
4. Image is pushed to Docker Hub
5. Terraform initializes infrastructure
6. Terraform applies Kubernetes configuration
7. Kubernetes creates Deployment (replicas)
8. Multi-container Pod runs:

   * App container (Node.js app)
   * Sidecar container (metrics exporter)
9. Kubernetes Service exposes app (NodePort 30008)
10. Rolling updates ensure zero downtime
11. Application is accessible via browser
12. Metrics exposed via /metrics endpoint
13. Prometheus scrapes metrics
14. Grafana displays dashboards

## 🚀 Complete Workflow Architecture

<p align="center">
  <img src="./assets/architecture.png" alt="Eventra DevOps Workflow" width="100%"/>
</p>

---

MULTI-CONTAINER ARCHITECTURE

Each Pod contains:

• Main Container:
Runs EVENTRA application on port 5000

• Sidecar Container:
Exposes metrics on port 9100
Used by Prometheus for monitoring

This pattern improves observability without modifying the main app.

---

CI/CD PIPELINE (JENKINS)

Stages:

1. Build Stage
   docker build --no-cache -t meghaeg/eventra:latest .

2. Push Stage
   docker push meghaeg/eventra:latest

3. Terraform Init
   terraform init

4. Terraform Apply
   terraform apply -auto-approve

Pipeline ensures automatic deployment after every change.

---

DEPLOYMENT DETAILS

Kubernetes Deployment:
• Replicas: 2
• Image Pull Policy: Always
• Rolling updates enabled

Kubernetes Service:
• Type: NodePort
• Port: 5000
• NodePort: 30008

Access Application:
http://localhost:30008

---

MONITORING SETUP

Prometheus:
• Scrapes metrics from sidecar container
• Stores time-series data

Grafana:
• Visualizes metrics
• Dashboards for:

* Request count
* CPU usage
* Memory usage

Access:
Prometheus → localhost:9090
Grafana → localhost:3000

---

KEY FEATURES

• Fully automated CI/CD pipeline
• Infrastructure as Code using Terraform
• Scalable Kubernetes deployment
• Multi-container pod architecture
• Zero downtime deployment (rolling updates)
• Real-time monitoring and visualization
• Reduced manual intervention

---

HOW TO RUN PROJECT

1. Clone repository
   git clone <repo-url>

2. Setup Jenkins credentials:
   • Docker Hub credentials
   • Kubernetes kubeconfig

3. Run Jenkins Pipeline:
   Click "Build Now"

4. Access Application:
   http://localhost:30008

---

FUTURE ENHANCEMENTS

• Add Helm charts for easier deployment
• Implement auto-scaling (HPA)
• Add logging with ELK stack
• Secure secrets using Kubernetes Secrets
• Enable GitHub webhook trigger (auto build)

---

CONCLUSION

This project demonstrates a production-level DevOps pipeline integrating CI/CD, containerization, orchestration, and monitoring. It ensures fast, reliable, and scalable deployments with complete visibility into application performance.
