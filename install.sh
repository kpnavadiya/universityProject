# to be executed on start
docker exec -it cli peer chaincode install -n mycc -p github.com/chaincode/go -v v0
docker exec -it cli peer chaincode instantiate -o orderer0.uni.com:7050 -C mychannel -n mycc github.com/chaincode -v v0 -c '{"Args": []}'

# install chaincode on peer0.universitymember.uni.com
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt 
peer chaincode install -n mycc -p github.com/chaincode/go -v v0

# # # install chaincode onpeer1.universitymember.uni.com .
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer1.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer1.universitymember.uni.com/tls/ca.crt 
peer chaincode install -n mycc -p github.com/chaincode/go -v v0


# # # install chaincode onpeer0.publicmember.uni.com .
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/users/Admin@publicmember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.publicmember.uni.com:7051 
export CORE_PEER_LOCALMSPID="PublicMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/peers/peer0.publicmember.uni.com/tls/ca.crt 
peer chaincode install -n mycc -p github.com/chaincode/go -v v0

# # # install chaincode on peer1.publicmember.uni.com.
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/users/Admin@publicmember.uni.com/msp 
export CORE_PEER_ADDRESS=peer1.publicmember.uni.com:7051 
export CORE_PEER_LOCALMSPID="PublicMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/peers/peer1.publicmember.uni.com/tls/ca.crt 
peer chaincode install -n mycc -p github.com/chaincode/go -v v0
