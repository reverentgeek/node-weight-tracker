#!/bin/bash
:set fileformat=unix


url=$1
id=$2
secret=$3

function installtion(){
        #<description>
        # This function install using apt all the  requirements for the App and the DB.

sudo apt-get install git
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install dotenv
sudo npm install postgres
sudo npm install nodemon
sudo npm install pm2 -g
sudo npm install cjs
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
}

function create(){
        #<description>
        # This function create the .env file with the arguments from the user to start the app.

ip=$(curl https://ipinfo.io/ip)
echo "# Host configuration
PORT=8080
HOST=0.0.0.0
NODE_ENV=development
HOST_URL=http://$ip:8080
COOKIE_ENCRYPT_PWD=superAwesomePasswordStringThatIsAtLeast32CharactersLong!

# Okta configuration
OKTA_ORG_URL=https://$1
OKTA_CLIENT_ID=$2
OKTA_CLIENT_SECRET=$3

# Postgres configuration
PGHOST=localhost
PGUSERNAME=postgres
PGDATABASE=postgres
PGPASSWORD=postgres
PGPORT=5432" > .env
}

function deploy(){
        #<description>
        # This function deploy the app and the DB
        # The app will run as srevice using pm2.
npm run initdb
sudo pm2 start npm -- run dev
sudo pm2 save
sudo pm2 startup
}

#Start of the script
installtion
create
deploy
