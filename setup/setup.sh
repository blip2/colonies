if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root or using sudo"
  exit
fi

echo 'Starting setup. All normal setup output is logged to setup.log'

cd "$(dirname "$0")"
> setup.log

echo 'Checking apt packages required are installed...'

if [ $(dpkg-query -W -f='${Status}' nodejs 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - >>setup.log
  sudo apt-get --assume-yes install -y nodejs >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' dnsmasq 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install dnsmasq >>setup.log
fi

if [ $(dpkg-query -W -f='${Status}' nginx 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  apt-get --assume-yes install nginx >>setup.log
fi

echo 'Copying configuration files...'

cp ./dots.dnsmasq.conf /etc/dnsmasq.d/
service dnsmasq restart

cp ./splash.html /var/www/html/index.html

cp ./dots.init.sh /etc/init.d/dots-server
chmod 755 /etc/init.d/dots-server
update-rc.d dots-server defaults

echo 'Installing node.js'

cd ../server/
npm install >>setup.log

echo 'Starting dots and boxes...'
service dots-server start
