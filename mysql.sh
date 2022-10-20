#!/bin/bash
echo ">>>>>>>>>>>>>>>>>Configure the Mysql[BEGIN]<<<<<<<<<<<<<<<<<<<"
sudo mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
exit
EOF
sudo service mysql restart
echo ">>>>>>>>>>>>>>>>>Configure the Mysql[END]<<<<<<<<<<<<<<<<<<<"