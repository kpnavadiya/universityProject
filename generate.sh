
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}/network-config
CHANNEL_NAME=mychannel

# create folders
mkdir -p config
mkdir -p crypto-config

# remove previous crypto material and config transactions
rm -fr ./config/*
rm -fr ./crypto-config/*


# generate crypto material
cryptogen generate --config=./network-config/crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# generate genesis block for orderer
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./config/orderer.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction for UniversityMember
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./config/UniversityMemberMSPanchors.tx -channelID $CHANNEL_NAME -asOrg UniversityMemberMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for UniversityMemberMSP..."
  exit 1
fi

# generate anchor peer transaction for PublicMember
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./config/PublicMemberMSPanchors.tx -channelID $CHANNEL_NAME -asOrg PublicMemberMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for PublicMemberMSP..."
  exit 1
fi

