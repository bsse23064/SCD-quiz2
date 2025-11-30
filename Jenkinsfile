pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mhamza0987/devops-fortune'
        registryCredential = 'dockerhub-creds-id'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/bsse23064/SCD-quiz2.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build(DOCKER_IMAGE + ":${env.BUILD_NUMBER}")
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

        stage('Deploy to K8s') {
            steps {
                sh 'kubectl apply -f kubernetes/redis-deployment.yaml'
                sh "kubectl set image deployment/fortune-app fortune-app=${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                sh 'kubectl rollout status deployment/fortune-app'
            }
        }
    }
}