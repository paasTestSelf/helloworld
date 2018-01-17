IP=$1
if [ $IP == "" ] ; then
  echo "Please input target ip address ! example : jenkin.sh 172.16.46.11"
  exit 1
fi

mvn clean package -Dmaven.test.skip=true
mv target/*.war ROOT.war
REGISTRY_HOST=registry.paas:443
USER_NAME=admin
CI_BUILD_REF_NAME=master
IMAGE=mscx_saassys_mgr
buildtime=$(date +%Y%m%d%H%M%S)
 docker login -u $USER_NAME -p 111111 -e kevin@qq.com $REGISTRY_HOST
 docker build -t registry.paas:443/${USER_NAME}/${IMAGE}:${buildtime} -f Dockerfile .
 docker login -u $USER_NAME -p 111111 -e kevin@qq.com $REGISTRY_HOST
 docker push registry.paas:443/${USER_NAME}/${IMAGE}:${buildtime}
result=`curl -X POST \
 -d "registry=${REGISTRY_HOST}&userName=$USER_NAME&image=$IMAGE&tag=${buildtime}&startPort=8080&description_resource=syh_docker_run&&description=v1.0000&deploy_timeout=180000&start_timeout=120000&stop_timeout=120000&destroy_timeout=120000" \
http://$IP:5081/svn/ws/registry/registResourceFromCI`
echo $result
if [ "$result" == '{"result":true }' ] ; then
	echo success
else
	exit 1
fi