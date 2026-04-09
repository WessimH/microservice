pipeline {
    agent any

    tools {
        nodejs 'NodeJS 25'
    }

    environment {
        RESEND_API_KEY = credentials('RESEND_API_KEY_SECRET')
    }

    stages {
        stage('Récupération du code') {
            steps {
                checkout scm
            }
        }

        stage('Installation des dépendances') {
            steps {
                sh 'npm install'
            }
        }

        stage('Tests Unitaires & Validation') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Tests E2E') {
            steps {
                sh 'npm run test:e2e'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'Tests réalisés avec succès !'
        }
        failure {
            echo 'Échec de la pipeline.'
        }
    }
}