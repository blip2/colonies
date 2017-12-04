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

if [ $(dpkg-query -W -f='${Status}' dnsmasq 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install dnsmasq >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' apache2 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install apache2 >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' unattended-upgrades 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install unattended-upgrades >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' nodejs 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - >>setup.log
  sudo apt-get --assume-yes install -y nodejs >>setup.log
fi

echo 'Copying configuration files...'

cp ./dots.dnsmasq.conf /etc/dnsmasq.d/
service dnsmasq restart

cp ./dots.init.sh /etc/init.d/dots-server
chmod 755 /etc/init.d/dots-server
update-rc.d dots-server defaults

cp ./dots-update.cron /etc/cron.d/dots-update
chmod u+x ./setup.sh
chmod u+x ./check-tunnel.sh

a2enmod rewrite ssl >>setup.log
cp ./dots.apache2.conf /etc/apache2/sites-enabled/000-default.conf
service apache2 restart >>setup.log

echo 'Creating/checking tunnel...'
bash check-tunnel.sh >>setup.log

echo 'Copying splash pages...'

cp -rf ../splash/* /var/www/html/
service nginx restart

echo 'Installing npm packages...'

cd ../server/
npm install >>setup.log 2>&1

echo 'Starting dots and boxes...'
service dots-server restart
