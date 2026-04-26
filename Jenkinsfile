pipeline {
    agent any

    environment {
        DOCKER_CREDS = credentials('dockerhub-creds')
        IMAGE_NAME = "meghaeg/eventra"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build --no-cache -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat 'echo %DOCKER_CREDS_PSW% | docker login -u %DOCKER_CREDS_USR% --password-stdin'
                bat 'docker push %IMAGE_NAME%:latest'
            }
        }

        stage('Terraform Init') {
            steps {
                bat 'cd terraform && terraform init'
            }
        }

        stage('Terraform Apply') {
            steps {
                bat 'cd terraform && terraform apply -auto-approve'
            }
        }

        // 🔥 IMPORTANT: Forces new pods → pulls latest image
        stage('Restart Deployment') {
            steps {
                bat 'kubectl rollout restart deployment eventra-deployment'
            }
        }
    }
}