# Colonies

Colonies is a light installation inspired by the combinational strategy game Dots and Boxes.

The rectangular grid that partitions the atrium is colonised by lines of light, that gradually appear and disappear, filling the structure with grouped patterns of colour.

This interactive artwork has been designed with an Internet of Things approach with a programming interface that allows web developers to create programs that can modify and extend the original design and behaviour.

- Concept and design - [Install Archive](http://www.installarchive.com/) (Luke Currall, Lee Regan)
- Lighting design, interaction design and programming - Arup (Francesco Anselmo, Inessa Demidova, Ben Hussey)
- Fabrication -  Keith Parker Fabrications

Work kindly loaned by James Layfield, Founder of Central Working

## System Design

The installation consists of many SPI RGB LED strips controlled by six Pico 2 microcontrollers which sit at the top of the installation.

The code.py code provides rudimentary direct control of the hardware and uses NeoPixel to output SPI. Input is a basic HTTP API used by the upstream server and not intended to be used by end users.

The server component is an node/express/socket.io service which translates from a more user friendly REST API (used by the frontend and by end-users) to communicate with the pico controllers.

The lighting will turn off automatically outside of 9am to 11pm weekdays or 20 minutes after a user interaction outside these times.

## Networking

The six WIZnet W5500-EVB-Pico2 with PoE modules and a wired ethernet connection to an 8-port switch which is connected directly to the headend server. There is a network port at high level on the cable basket next to the installation which connects directly to the wall port in the office.

The six controllers are configured as follows (wired MAC, wired IP assigned by DHCP):
- Colonies0 - 00:08:DC:8c:72:eb - 192.168.10.100
- Colonies1 - 00:08:DC:6c:d8:d5 - 192.168.10.101
- Colonies2 - 00:08:DC:aa:4d:56 - 192.168.10.102
- Colonies3 - 00:08:DC:79:7d:67 - 192.168.10.103
- Colonies4 - 00:08:DC:69:c6:9b - 192.168.10.104
- Colonies5 - 00:08:DC:85:74:33 - 192.168.10.105
- Colonies6 - 00:08:DC:d2:6f:8d - 192.168.10.106 (spare)
- Test Unit - 00:08:DC:37:73:c6 - 192.168.10.110 (test)

The server runs on a RaspberryPi 4 running Raspbian which is connected to the office wall port. The server also connects to the Bradfield Centre wireless network with a fixed IP to allow users to interact with the installation.

Server configuration:
- Wired connection - e4:5f:01:4a:00:6a - 192.168.10.1
- Wireless connection - e4:5f:01:4a:00:6b - 192.168.53.254

## Wiring

Wiring colours used in the multicore cables within the installation:
- Yellow/Orange: negative (supplemented with black single core for longer runs)
- White/Blue/Purple: positive (supplemented with red single core for longer runs)
- Green/Black/Brown: SPI control signal (connected to each of the three strips running in each tube, 4 strips in sequence in separate tubes)

The colors above connect to wiring from the LED strip as follows: white (negative), red (positive), green (SPI control)

## Pico Development

CircuitPython is used for the Pico controllers. Required libraries are listed in the code.py file.

The boot.py file allows for over the air updates to code.py - to enable this GP13 needs to be connected to ground which enables writing to flash from within the web server but disables the USB interface. This link needs to be cut for further manual programming.

## Web Development

Configured as Docker containers with docker installed `docker-compose up` should start the client (nuxt) in development mode and service (node) in the background.

## Deployment

The scripts in setup/ will help bootstrap a server from scratch. The docker image from ghcr is used.

Use `bash produp.sh` to update and restart the server image.

## Support

The installation software is currently being maintained by Ben Hussey (ben@blip2.net). Pull requests are very welcome.
