# to be executed on start
docker exec -it cli peer chaincode install -n mycc -p github.com/chaincode -v v0
docker exec -it cli peer chaincode instantiate -o orderer0.uni.com:7050 -C mychannel -n mycc github.com/chaincode -v v0 -c '{"Args": []}'

# CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/admin.example.com/users/Admin@admin.example.com/msp CORE_PEER_ADDRESS=peer0.admin.example.com:7051 CORE_PEER_LOCALMSPID="AdminMSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/admin.example.com/peers/peer0.admin.example.com/tls/ca.crt peer chaincode install -n mycc -p github.com/chaincode -v v0

# # Join peer0.manager.example.com to the channel
# CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manager.example.com/users/Admin@manager.example.com/msp CORE_PEER_ADDRESS=peer0.manager.example.com:7051 CORE_PEER_LOCALMSPID="ManagerMSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manager.example.com/peers/peer0.manager.example.com/tls/ca.crt peer chaincode install -n mycc -p github.com/chaincode -v v0


# # Join peer0.vendor.example.com to the channel
# CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/vendor.example.com/users/Admin@vendor.example.com/msp CORE_PEER_ADDRESS=peer0.vendor.example.com:7051 CORE_PEER_LOCALMSPID="VendorMSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/vendor.example.com/peers/peer0.vendor.example.com/tls/ca.crt peer chaincode install -n mycc -p github.com/chaincode -v v0
# # Join peer0.user.example.com to the channel
# CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/user.example.com/users/Admin@user.example.com/msp CORE_PEER_ADDRESS=peer0.user.example.com:7051 CORE_PEER_LOCALMSPID="UserMSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/user.example.com/peers/peer0.user.example.com/tls/ca.crt peer chaincode install -n mycc -p github.com/chaincode -v v0
