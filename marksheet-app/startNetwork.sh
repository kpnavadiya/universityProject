#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
# This code is based on code written by the Hyperledger Fabric community. 
# Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/startFabric.sh
#
# Exit on first error

set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

#../universitychain/start.sh

# docker exec -it cli bash
# Create Channel
export CHANNEL_NAME=mychannel
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp 
export CORE_PEER_ADDRESS=peer0.universitymember.uni.com:7051 
export CORE_PEER_LOCALMSPID="UniversityMemberMSP" 
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt
peer channel create -o orderer0.uni.com:7050 -c $CHANNEL_NAME -f ./configs/channel.tx 
# join channel
peer channel join -b mychannel.block
# Install chaincode
peer chaincode install -n marksheet -p github.com/chaincode/src/marksheet -v v0
peer chaincode instantiate -o orderer0.uni.com:7050 -C mychannel -n marksheet github.com/chaincode/src/marksheet -v v0 -c '{"Args": ["init"]}'
peer chaincode invoke -o orderer2.uni.com:7050 -n marksheet -c '{"Args":["initLedger"]}' -C mychannel

printf "\nTotal execution time : $(($(date +%s) - starttime)) secs ...\n\n"
printf "\nStart with the registerAdmin.js, then registerUser.js, then server.js\n\n"
