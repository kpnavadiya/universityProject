export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/network-config


#configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./configuration/testchannel2.tx -channelID $CHANNEL_NAME


## for loop
for i in {1..1000}
do
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./configuration/test/test$i.tx -channelID test$i

done
