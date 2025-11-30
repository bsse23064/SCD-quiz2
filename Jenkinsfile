pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mhamza0987/devops-fortune' 
        registryCredential = 'dockerhub-creds-id'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build(DOCKER_IMAGE + ":v${env.BUILD_NUMBER},"./app")
                }
            }
        }

        stage('Push to Hub') {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f kubernetes/app-deployment.yaml'
                sh 'kubectl apply -f kubernetes/app-service.yaml'
                sh 'kubectl apply -f kubernetes/redis-deployment.yaml'
                sh "kubectl set image deployment/fortune-app fortune-app=${DOCKER_IMAGE}:v${env.BUILD_NUMBER}"
                sh 'kubectl rollout status deployment/fortune-app'
            }
        }
    }
}