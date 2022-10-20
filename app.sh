#!/bin/bash
echo ">>>>>>>>>>>>>>>>>Hello World<<<<<<<<<<<<<<<<<<<"
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install nginx -y
sudo apt-get install mysql-server -y
sudo apt-get install nodejs -y
sudo apt-get install npm -y
sudo apt-get clean
echo ">>>>>>>>>>>>>>>>>Bye World<<<<<<<<<<<<<<<<<<<"