#!/bin/bash

TUNNEL_HOST=51.195.201.21
TUNNEL_PORT=13343
CHECK_PORT=19922

createTunnel() {
    /usr/bin/ssh -f -i /home/pi/.ssh/id_ed25519 -N -R$TUNNEL_PORT:localhost:22 -L$CHECK_PORT:$TUNNEL_HOST:22 tunnel@$TUNNEL_HOST
    if [[ $? -eq 0 ]]; then
        echo Tunnel to $TUNNEL_HOST created successfully
    fi
}
## Run the 'ls' command remotely.  If it returns non-zero, then create a new connection
netcat -w 1 localhost $CHECK_PORT
if [[ $? -ne 0 ]]; then
    echo Creating new tunnel connection
    createTunnel
fi
