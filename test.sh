echo "Backing up .env"
cp packages/server/.env .env-tmp
echo "Copying test credentials to .env file..."
cat packages/server/.env-test > packages/server/.env
echo "Running tests! This might take a while.."
lerna run test
echo "Restoring .env"
mv .env-tmp packages/server/.env
