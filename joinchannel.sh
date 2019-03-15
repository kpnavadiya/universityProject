# join other peers using cli bash
# Create channel
export CHANNEL_NAME=mychannel
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt 
export O_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/uni.com/orderers/orderer0.uni.com/msp/tlscacerts/tlsca.uni.com-cert.pem
peer channel create -o orderer0.uni.com:7050 -c $CHANNEL_NAME -f ./config/channel.tx --tls --cafile $O_CA

# # # Join peer0.universitymember.uni.com to the channel
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt 
peer channel join -b mychannel.block

# # # Join peer1.universitymember.uni.com to the channel.
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer1.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer1.universitymember.uni.com/tls/ca.crt 
peer channel join -b mychannel.block


# # # Join peer0.publicmember.uni.com to the channel.
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/users/Admin@publicmember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.publicmember.uni.com:7051 
export CORE_PEER_LOCALMSPID="PublicMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/peers/peer0.publicmember.uni.com/tls/ca.crt 
peer channel join -b mychannel.block

# # # Join peer1.publicmember.uni.com to the channel.
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/users/Admin@publicmember.uni.com/msp 
export CORE_PEER_ADDRESS=peer1.publicmember.uni.com:7051 
export CORE_PEER_LOCALMSPID="PublicMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/publicmember.uni.com/peers/peer1.publicmember.uni.com/tls/ca.crt 
peer channel join -b mychannel.block