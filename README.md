# AaravTimesheetApp
Part of the HRMS.

Prerequisites:

Python 2.7
Node
Elasticsearch

Running the app:

See ~/Elasticsearch/modeling.txt to configure and launch elasticsearch
sudo npm install -g @angular/cli
cd ~/Node
Delete package-lock.json
sudo npm install                # Install Node packages required for backend
npm start
cd ~/Angular
Delete package-lock.json
sudo npm install                # Packages for frontend
nohup ng serve --host [host ip address] --port [port number] --disableHostCheck true &

Note: If any errors persist while installing node packages, try again after doing this
sudo npm cache clean --force