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
apt-get update >>setup.log

apt-get --assume-yes install curl unclutter autossh unattended-upgrades vim ca-certificates >>setup.log
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc >>setup.log
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update >>setup.log

apt-get --assume-yes install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >>setup.log
apt-get clean

adduser pi docker

echo 'Apply SD card hardening...'

LINE="tmpfs    /tmp    tmpfs    defaults,noatime,nosuid,size=100m    0 0
tmpfs    /var/tmp    tmpfs    defaults,noatime,nosuid,size=30m    0 0
tmpfs    /var/log    tmpfs    defaults,noatime,nosuid,mode=0755,size=100m    0 0"
FILE='/etc/fstab'
grep -qF -- "$LINE" "$FILE" || echo "$LINE" >> "$FILE"

tune2fs -c -1 -i 0 /dev/mmcblk0p2 >>setup.log
dphys-swapfile >>setup.log
swapoff -a >>setup.log
rm -r /var/swap >>setup.log
systemctl disable dphys-swapfile.service >>setup.log
systemctl disable nfs-client.target >>setup.log

echo 'Copying configuration files...'

cp ./colonies.cron /etc/cron.d/colonies
chmod u+x ./check-tunnel.sh

cp ./autostart /etc/xdg/lxsession/LXDE-pi/autostart

chown -R pi:pi /home/pi/colonies/

echo 'Creating autostart / desktop icon...'

echo "[Desktop Entry]
Name=Colonies
Exec=~/colonies/setup/autostart.sh
Type=Application
Terminal=false" > ~/Desktop/colonies.desktop
chmod u+x ~/Desktop/colonies.desktop

echo "[Desktop Entry]
Name=Colonies
Exec=~/colonies/setup/autostart.sh
Type=Application
Terminal=false" > ~/.config/autostart/colonies.desktop
chmod u+x ~/.config/autostart/colonies.desktop

echo 'Running Docker...'

cd ..
bash produp.sh
