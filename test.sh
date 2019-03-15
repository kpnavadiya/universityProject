docker exec -it cli peer chaincode invoke -o orderer2.uni.com:7050 -n mycc -c '{"Args":["initLedger"]}' -C mychannel

docker exec -it cli peer chaincode invoke -o orderer2.uni.com:7050 -n mycc -c '{"Args":["createMarksheet","MARK6",kp1","1","rag","6","8.6"]}' -C mychannel


peer chaincode query -o orderer2.uni.com:7050 -n mycc -c '{"Args":["queryAllMarksheet"]}' -C mychannel

peer chaincode query -o orderer2.uni.com:7050 -n mycc -c '{"Args":["queryMarksheet","MARK0"]}' -C mychannel

