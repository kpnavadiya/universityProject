# For chacking peer0 joind chennel run below comand in CLI bash

export CHANNEL_NAME=mychannel
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt 

# peer channel list
