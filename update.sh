rv="v$(shuf -i 200-10000 -n 1)"

docker exec -it cli peer chaincode install -n mycc -p github.com/chaincode/go -v "$rv"

docker exec -it cli peer chaincode upgrade -o orderer0.uni.com:7050 -C mychannel -n mycc github.com/chaincode/go -v "$rv" -c '{"Args": []}'
