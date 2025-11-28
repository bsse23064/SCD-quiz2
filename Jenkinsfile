pipeline {
    agent any

    environment {
        // Replace with your DockerHub username
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')
        IMAGE_NAME = "mhamza0987/cafe-app"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo 'Checking out source code from Git...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    echo 'Pushing image to Docker Hub...'
                    sh "docker push $IMAGE_NAME:$IMAGE_TAG"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo 'Deploying to Kubernetes...'
                    // Updates the image in the deployment to the new tag we just built
                    sh "kubectl set image deployment/cafe-deployment cafe-container=$IMAGE_NAME:$IMAGE_TAG"
                    sh "kubectl rollout status deployment/cafe-deployment"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline successfully completed. Cafe is live!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}