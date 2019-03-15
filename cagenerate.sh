
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

# peer1.universitymember.uni.com
cp crypto-config/peerOrganizations/universitymember.uni.com/peers/peer1.universitymember.uni.com/tls/ca.crt configuration/certs/universityMemberTest.pem
# Build images for ca
docker build -t universitymember-ca:latest universitymemberCA/

# Generate container
docker-compose -f ./network-config/docker-compose-ca.yml up -d

