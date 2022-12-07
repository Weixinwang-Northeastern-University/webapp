#!/bin/sh
sudo apt-get update
sudo apt-get upgrade -y
sleep 15
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sleep 15
whereis node
echo "npm version is $(npm --version)"
sleep 15
echo "Installing unzip"
sudo apt-get install unzip
sleep 15
unzip /home/ubuntu/webapp.zip -d /home/ubuntu/webapp
sudo rm -rf /home/ubuntu/webapp.zip
sleep 5
cd /home/ubuntu
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
sleep 15
cd /home/ubuntu/webapp
sudo npm install
sleep 15
sudo mkdir -p /home/ubuntu/webapp/logs
sudo touch /home/ubuntu/webapp/logs/csye6225.log
sudo chmod 777 /home/ubuntu/webapp/logs/csye6225.log
sleep 15
cd /home/ubuntu
wget https://s3.us-east-1.amazonaws.com/amazoncloudwatch-agent-us-east-1/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E amazon-cloudwatch-agent.deb
sudo cp /home/ubuntu/webapp/cloudwatch-config.json /opt/cloudwatch-config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
-a fetch-config \
-m ec2 \
-c file:/opt/cloudwatch-config.json \
-s
