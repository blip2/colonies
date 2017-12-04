#!/bin/bash

createTunnel() {
    route del default gw 192.168.10.1 eno1
    /usr/bin/ssh -f -i /home/dots/.ssh/id_rsa -N -R13344:localhost:22 -L19922:130.211.66.54:22 tunnel@130.211.66.54
    if [[ $? -eq 0 ]]; then
        echo Tunnel to 130.211.66.54 created successfully
    fi
}
## Run the 'ls' command remotely.  If it returns non-zero, then create a new connection
/usr/bin/ssh -i /home/dots/.ssh/id_rsa -p 19922 tunnel@localhost ls
if [[ $? -ne 0 ]]; then
    echo Creating new tunnel connection
    createTunnel
fi
