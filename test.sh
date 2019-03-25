docker exec -it cli peer chaincode invoke -o orderer2.uni.com:7050 -n mycc -c '{"Args":["initLedger"]}' -C mychannel

docker exec -it cli peer chaincode invoke -o orderer2.uni.com:7050 -n mycc -c '{"Args":["createMarksheet","MARK5","kp1","1","rag","6","8.6"]}' -C mychannel


peer chaincode query -o orderer2.uni.com:7050 -n mycc -c '{"Args":["queryAllMarksheet"]}' -C mychannel

peer chaincode query -o orderer2.uni.com:7050 -n mycc -c '{"Args":["queryMarksheet","kp"]}' -C mychannel


#Rich Query with index name explicitly specified:
peer chaincode query -C mychannel -n marksheet4 -c '{"Args":["readMarksheet", "{\"selector\":{\"docType\":\"name\",\"enrolno\":\"1\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'


export CHANNEL_NAME=mychannel
peer chaincode instantiate -o orderer0.uni.com:7050 -C mychannel -n marbles -v 1.0 -c '{"Args":["init"]}' -P "OR ('UniversityMemberMSP.peer','PublicMemberMSP.peer')"

peer chaincode invoke -o orderer0.uni.com:7050 -C mychannel -n marbles1 -c '{"Args":["initMarble","marble1","blue","35","tom"]}'

#--tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
peer chaincode query -C mychannel -n marbles1 -c '{"Args":["queryMarbles", "{\"selector\":{\"docType\":\"marble\",\"owner\":\"tom\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'

# Cheack Indxing 
docker logs peer0.universitymember.uni.com  2>&1 | grep "CouchDB index"

docker exec -it cli peer chaincode query -o orderer2.example.com -C mychannel -n mycc -c '{"Args":["RichqueryPayments","{\"selector\":{\"trandt\":\"pay3\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'
