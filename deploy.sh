#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit
echo "Deployment tool v1"
echo "Describe the changes in this deployment: "
read changelog

echo "Making sure that all tests pass before deploying..."
echo "Backing up .env"
cp packages/server/.env .env-tmp
echo "Copying test credentials to .env file..."
cat packages/server/.env-test > packages/server/.env
echo "Running tests! This might take a while.."
lerna run test
echo "Restoring .env"
mv .env-tmp packages/server/.env

echo "Pushing changes to GitHub..."
git add .
date +"%D %T"
currentDate=`date`
if  git commit -m "deployment($currentDate): $changelog"; then 
    git push
else
    echo "Nothing to commit. Exiting deployment..."
    exit 1
fi
echo "Connecting to Droplet & deploying..."
start=$(date +"%s")
ssh root@174.138.58.117 '
    cd ~/CovEducation; 
    git pull; 
    forever stop 0; 
    yarn;
    cd packages/server;
    forever start -c "nodemon --exitcrash --config nodemon.json" src/index.ts'
end=$(date +"%s")
DIFF=$(($end-$start))

if ping -c 5 www.coved.org; then 
    echo "New version succesfully deployed! 🎉"
    echo "Total downtime:  $((($DIFF % 3600) / 60)) minutes $(($DIFF % 60)) seconds"
else
    echo "Failed to start DigitalOcean droplet. Please ssh into the droplet to debug."
fi
