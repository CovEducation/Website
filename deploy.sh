#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit

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
git commit -m "Deployment: $currentDate"
git push

echo "Connecting to Droplet & deploying..."
ssh root@174.138.58.11 'git pull; forever stop 0; npm ci; lerna run serve'

if ping www.coved.org; then 
    echo "New version succesfully deployed! 🎉"
else
    echo "Failed to start DigitalOcean droplet. Please login to the console to debug."

