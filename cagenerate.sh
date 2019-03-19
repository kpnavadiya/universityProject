
# Remove old ca and tls  from universitymemberCA
rm -rf universitymemberCA/ca
rm -rf universitymemberCA/tls
# Add new directory
mkdir -p universitymemberCA/ca
mkdir -p universitymemberCA/tls

# Copy  universitymember org. ca and tlsca cirti into CA 
cp ./crypto-config/peerOrganizations/universitymember.uni.com/ca/* universitymemberCA/ca
cp ./crypto-config/peerOrganizations/universitymember.uni.com/tlsca/* universitymemberCA/tls
mv ./universitymemberCA/ca/*_sk ./universitymemberCA/ca/key.pem
mv ./universitymemberCA/ca/*-cert.pem ./universitymemberCA/ca/cert.pem
mv ./universitymemberCA/tls/*_sk ./universitymemberCA/tls/key.pem
mv ./universitymemberCA/tls/*-cert.pem ./universitymemberCA/tls/cert.pem

rm -rf configuration/certs
mkdir -p configuration/certs
# Copy cert in configrution
cp crypto-config/ordererOrganizations/uni.com/orderers/orderer0.uni.com/tls/ca.crt configuration/certs/orderer0.pem

cp crypto-config/peerOrganizations/universitymember.uni.com/peers/peer0.universitymember.uni.com/tls/ca.crt configuration/certs/universityMember.pem
cp crypto-config/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp/keystore/* configuration/certs/Admin@universityMember-org-key.pem
cp crypto-config/peerOrganizations/universitymember.uni.com/users/Admin@universitymember.uni.com/msp/signcerts/* configuration/certs/

cp crypto-config/peerOrganizations/publicmember.uni.com/peers/peer0.publicmember.uni.com/tls/ca.crt configuration/certs/publicmember.pem
cp crypto-config/peerOrganizations/publicmember.uni.com/users/Admin@publicmember.uni.com/msp/keystore/* configuration/certs/Admin@publicmember-org-key.pem
cp crypto-config/peerOrganizations/publicmember.uni.com/users/Admin@publicmember.uni.com/msp/signcerts/* configuration/certs/
# peer1.universitymember.uni.com
cp crypto-config/peerOrganizations/universitymember.uni.com/peers/peer1.universitymember.uni.com/tls/ca.crt configuration/certs/universityMemberTest.pem
# Build images for ca
docker build -t universitymember-ca:latest universitymemberCA/

# Generate container
docker-compose -f ./network-config/docker-compose-ca.yml up -d

