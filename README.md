# Colonies

Colonies is a light installation inspired by the combinational strategy game Dots and Boxes.

The rectangular grid that partitions the atrium is colonised by lines of light, that gradually appear and disappear, filling the structure with grouped patterns of colour.

This interactive artwork has been designed with an Internet of Things approach with a programming interface that allows web developers to create programs that can modify and extend the original design and behaviour.

- Concept and design - [Install Archive](http://www.installarchive.com/) (Luke Currall, Lee Regan)
- Lighting design, interaction design and programming - Arup (Francesco Anselmo, Inessa Demidova, Ben Hussey)
- Fabrication -  Keith Parker Fabrications

Work kindly loaned by James Layfield, Founder of Central Working

## System Design

The installation consists of many SPI RGB LED strips controlled by six Arduino Yún which sit at the top of the installation.

The SegmentController.ino code provides rudimentary direct control of the hardware and uses FastLED to output SPI. Input is a basic HTTP API used by the upstream server and not intended to be used by end users.

The server component is an node/express/socket.io service which translates from a more user friendly REST API (used by the frontend and by end-users) to communicate with the Yún controllers.

## Networking

The six Arduino Yún have a wired ethernet connection to an 8-port switch which is connected directly to the headend server. There is a network port at high level on the cable basket next to the installation which connects directly to the wall port in the office.

The six Yun are configured as follows (wireless MAC, wired IP):
- Colonies1 - B4218AF06D0B - 192.168.10.101
- Colonies2 - B4218AF069F6 - 192.168.10.102
- Colonies3 - B4218AF069F4 - 192.168.10.103
- Colonies4 - B4218AF06C00 - 192.168.10.104
- Colonies5 - B4218AF06D1C - 192.168.10.105
- Colonies6 - B4218AF06D14 - 192.168.10.106

The server runs on a RaspberryPi 4 running Raspbian which is connected to the office wall port. The server also connects to the Bradfield Centre wireless network with a fixed IP to allow users to interact with the installation.

Server configuration:
- Wired connection - e4:5f:01:4a:00:6a - 192.168.10.1
- Wireless connection - e4:5f:01:4a:00:6b - 192.168.65.2

SSH to each Yun is possible from the server with: `ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 root@192.168.10.101`

## Development

Configured as Docker containers with docker installed `docker-compose up` should start the client (nuxt) in development mode and service (node) in the background.

## Deployment

The scripts in setup/ will help bootstrap a server from scratch. The docker image from ghcr is used.

Use `bash produp.sh` to update and restart the server image.

## Support

The installation software is currently being maintained by Ben Hussey (ben@blip2.net). Pull requests are very welcome.
