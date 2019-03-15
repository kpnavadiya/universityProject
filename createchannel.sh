
# # # Create the channel my channel
export pwd
docker exec -it cli -e "CORE_PEER_LOCALMSPID=UniversityMemberMSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@universitymember.uni.com/msp" peer0.universitymember.uni.com peer channel create -o orderer0.uni.com:7050 -c mychannel -f /var/hyperledger/configs/channel.tx

#peer0.universitymember.uni.com
#docker exec -e "CORE_PEER_LOCALMSPID=UniversityMemberMSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@universitymember.uni.com/msp" peer0.universitymember.uni.com peer channel join -b mychannel.block


