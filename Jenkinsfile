// Jenkinsfile
String credentialsId = 'awsCredentials'

  stage('checkout') {
    node {
      cleanWs()
      checkout scm
    }
  }
  
      stage('S3download')
          {
              node {
                  withAWS(region:'us-east-1',credentials:'awsCredentials')\
                  {
                      s3Download bucket: 'web-app-bucket-gal', file: 'var.txt', path: 'var.txt'
                  }
              }
          }
          
          stage('build')
          {
              node {
                  sh 'dos2unix deploy.sh'
                  sh "chmod +x -R ${env.WORKSPACE}"
                  sh '(set -f; deploy.sh $(cat var.txt))'
              }
          }
          
          
  
   
