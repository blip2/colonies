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

The headend server runs on a Acer small form factor PC running Ubuntu which is connected to the office wall port. The server also connects to the Bradfield Centre wireless network with a fixed IP to allow users to interact with the installation.

## Support

The installation software is currently being maintained by Ben Hussey (ben@blip2.net). Pull requests are very welcome.
