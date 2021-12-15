if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root or using sudo"
  exit
fi

echo 'Starting setup. All normal setup output is logged to setup.log'

cd "$(dirname "$0")"
> setup.log

echo 'Pulling latest version of this script...'

git pull >>setup.log

echo 'Checking apt packages required are installed...'

if [ $(dpkg-query -W -f='${Status}' curl 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install curl >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' unclutter 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install unclutter >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' unattended-upgrades 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install unattended-upgrades >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' vim 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install vim >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' docker 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install ca-certificates curl gnupg lsb-release >>setup.log
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg >>setup.log
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update >>setup.log
  apt-get --assume-yes install docker-ce docker-ce-cli containerd.io >>setup.log
fi

curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

echo 'Copying configuration files...'

cp ./dots-update.cron /etc/cron.d/dots-update

cp ./autostart /etc/xdg/lxsession/LXDE-pi/autostart

echo 'Starting colonies...'
cd /home/pi/colonies/
docker-compose -f docker-compose.prod.yml up --build -d
