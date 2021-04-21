// Jenkinsfile
String credentialsId = 'awsCredentials'

try {
  stage('checkout') {
    node {
      cleanWs()
      checkout scm
    }
  }
  
   stage('clone') {
    node {
      git  https://github.com/galyakir/Terraform-project
    }
  }

  // Run terraform init
  stage('init') {
    node {
      withCredentials([[
        $class: 'AmazonWebServicesCredentialsBinding',
        credentialsId: credentialsId,
        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
      ]]) {
        ansiColor('xterm') {
          sh 'terraform init'
        }
      }
    }
  }

  stage('S3download')
          {
              node {
                  withAWS(region:'us-east-1',credentials:'awsCredentials')\
                  {
                      s3Download bucket: 'web-app-bucket-gal', file: 'terraform.tfvars.json', path: 'terraform.tfvars.json'
                  }
              }
          }

  stage('plan') {
      node {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: credentialsId,
          accessKeyVariable: 'AWS_ACCESS_KEY_ID',
          secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        ]]) {
          ansiColor('xterm') {
             sh 'echo $PWD'
            sh 'terraform plan'
          }
        }
      }
    }

  if (env.BRANCH_NAME == 'master') {

    // Run terraform apply
    stage('apply and deploy') {
      node {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: credentialsId,
          accessKeyVariable: 'AWS_ACCESS_KEY_ID',
          secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        ]]) {
          ansiColor('xterm') {
            sh 'terraform apply -auto-approve'
          }
        }
      }
    }
     stage('destroy') {
          node {
            withCredentials([[
              $class: 'AmazonWebServicesCredentialsBinding',
              credentialsId: credentialsId,
              accessKeyVariable: 'AWS_ACCESS_KEY_ID',
              secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
            ]]) {
              ansiColor('xterm') {
                    sh 'sleep 60'
                    sh 'terraform destroy -auto-approve'
              }
            }
          }
        }
  }



  currentBuild.result = 'SUCCESS'
}
catch (org.jenkinsci.plugins.workflow.steps.FlowInterruptedException flowError) {
  currentBuild.result = 'ABORTED'
}
catch (err) {
  currentBuild.result = 'FAILURE'
  throw err
}
finally {
  if (currentBuild.result == 'SUCCESS') {
    currentBuild.result = 'SUCCESS'
  }
}
