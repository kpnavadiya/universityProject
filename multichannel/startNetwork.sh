#!/bin/bash
#
# Create two channel and join one peer of the universityMember orgnaization.
# 1. mychannel 
# 2. testchannel
# install two differnt chaincode on channel
# Ex . mark and marksheet
# Exit on first error

set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

# Start the network
#../universitychain/start.sh

# docker exec -it cli bash
# this command will be run in CLI container so first get into tham using above command.

# Create first Channel
export CHANNEL_NAME=mychannel
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt
peer channel create -o orderer0.uni.com:7050 -c $CHANNEL_NAME -f ./configs/mychannel.tx 
# join channel
peer channel join -b mychannel.block
# Install chaincode
peer chaincode install -n marksheet -p github.com/chaincode/src/marksheet -v v0
peer chaincode instantiate -o orderer0.uni.com:7050 -C mychannel -n marksheet github.com/chaincode/src/marksheet -v v0 -c '{"Args": ["init"]}'
peer chaincode invoke -o orderer2.uni.com:7050 -n marksheet -c '{"Args":["initLedger"]}' -C mychannel

#################################################################################################################
################# SECOND CHANNEL ################################################################################

export CHANNEL_NAME=testchannel
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt
peer channel create -o orderer0.uni.com:7050 -c $CHANNEL_NAME -f ./configs/testchannel.tx 
# join channel
peer channel join -b testchannel.block
# Install chaincode
peer chaincode install -n cama -p github.com/chaincode/src/cama -v v0
peer chaincode instantiate -o orderer0.uni.com:7050 -C testchannel -n cama github.com/chaincode/src/cama -v v0 -c '{"Args": ["init"]}'
#peer chaincode invoke -o orderer2.uni.com:7050 -n cama -c '{"Args":["initLedger"]}' -C testchannel

