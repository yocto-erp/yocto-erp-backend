#!/bin/bash
source ~/.nvm/nvm.sh
nvm use 24
git pull
npm install
npm run build
systemctl restart yocto
tail -f /usr/project/instance/yocto/app.log
