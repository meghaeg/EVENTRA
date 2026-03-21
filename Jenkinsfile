pipeline {
    agent any

    environment {
        DOCKER_CREDS = credentials('dockerhub-creds')
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/meghaeg/EVENTRA.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t meghaeg/eventra .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                sh 'docker push meghaeg/eventra'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}