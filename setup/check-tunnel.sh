#!/bin/bash

createTunnel() {
    /usr/bin/ssh -f -i /home/pi/.ssh/id_ed25519 -N -R13344:localhost:22 -L19922:51.195.201.21:22 tunnel@51.195.201.21
    if [[ $? -eq 0 ]]; then
        echo Tunnel to 51.195.201.21 created successfully
    fi
}
## Run the 'ls' command remotely.  If it returns non-zero, then create a new connection
/usr/bin/ssh -i /home/pi/.ssh/id_ed25519 -p 19922 tunnel@localhost ls
if [[ $? -ne 0 ]]; then
    echo Creating new tunnel connection
    createTunnel
fi
