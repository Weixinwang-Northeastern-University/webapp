#!/bin/sh
sudo apt-get update
sudo apt-get upgrade -y
sleep 30
sudo apt-get install nginx -y
sleep 15
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sleep 15
whereis node
echo "npm version is $(npm --version)"
sleep 5
echo "Installing unzip"
sudo apt-get install unzip
sleep 5
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sleep 5
unzip /home/ubuntu/a5.zip -d /home/ubuntu/a5
sudo rm -rf /home/ubuntu/a5.zip
sleep 5
sudo cp -f /home/ubuntu/a5/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/bin/config.json
cd /home/ubuntu/a5
sudo npm install
