set -ev
#docker rm -f $(docker ps -aq)
# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f ./network-config/docker-compose-kafka.yml down
docker-compose -f ./network-config/docker-compose-cli.yml down


docker-compose -f ./network-config/docker-compose-kafka.yml up -d
docker-compose -f ./network-config/docker-compose-cli.yml up -d
docker-compose -f ./network-config/ca-base.yaml up -d

# go to the blockchain directory 
 # run npm install
 # To start network and create channel run 	
 # node setup.js
