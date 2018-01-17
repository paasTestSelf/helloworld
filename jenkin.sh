mvn clean package -Dmaven.test.skip=true
mv target/*.war ROOT.war
REGISTRY_HOST=registry.docker:5000
USER_NAME=admin
CI_BUILD_REF_NAME=master
IMAGE=helloworld
buildtime=$(date +%Y%m%d%H%M%S)
 docker login -u $USER_NAME -p 111111  $REGISTRY_HOST
 docker build -t registry.docker:5000/${USER_NAME}/${IMAGE}:${buildtime} -f Dockerfile .
 docker login -u $USER_NAME -p 111111  $REGISTRY_HOST
 docker push registry.docker:5000/${USER_NAME}/${IMAGE}:${buildtime}

echo "buuld success"
