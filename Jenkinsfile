pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git(
                    branch: 'master',
                    credentialsId: 'github-pat',
                    url: 'https://github.com/yusrilz/ticket-site-be.git'
                )
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
