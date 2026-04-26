provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "eventra" {
  metadata {
    name = "eventra-deployment"
    labels = {
      app = "eventra"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "eventra"
      }
    }

    template {
      metadata {
        labels = {
          app = "eventra"
        }
      }

      spec {

        #  MAIN APPLICATION CONTAINER
        container {
          name  = "eventra"
          image = "meghaeg/eventra:latest"
          image_pull_policy = "Always"

          port {
            container_port = 5000
          }
        }

        #  SIDECAR CONTAINER (Metrics exporter)
        container {
          name  = "metrics-sidecar"
          image = "prom/node-exporter"

          port {
            container_port = 9100
          }
        }
      }
    }
  }
}

# Service
resource "kubernetes_service" "eventra_service" {
  metadata {
    name = "eventra-service"
    labels = {
      app = "eventra"
    }
  }

  spec {
    selector = {
      app = "eventra"
    }

    port {
      name        = "http"
      port        = 5000
      target_port = 5000
      node_port   = 30008
    }

    type = "NodePort"
  }
}