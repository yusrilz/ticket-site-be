pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git(
                    branch: 'master',
                    credentialsId: 'github-id',
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

        stage('Run Seeds') {
            steps {
                sh 'docker compose exec -T app npm run seed'
            }
        }

    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
