/*
  Dots and Boxes Segment Controller
  Written for Arduino Yún

  Valid API commands:
  "/arduino/segment/X/Y/H"
  "/arduino/fade/X/Y/HHSSVV/HHSSVV/t" (WIP)
  "/arduino/pixel/X/Y/Z/HHSSVV" (WIP)
  where H, X, Y, Z are integers
  H - Hue from 0 to 255
  X - Strip from 0 to 2
  Y - Segment from 0 to 3
  Z - Pixel from 0 to 31

*/

#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>
#include "FastLED.h"

BridgeServer server;

// LED Strip Configuration
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB

#define NUM_LEDS 128
#define SEGMENT_LEN 32
#define NUM_STRIPS 3
CRGB leds[NUM_STRIPS][NUM_LEDS];

void setup() {
  // Sadly these have to be defined manually rather than parametrically...
  FastLED.addLeds<LED_TYPE, 2>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 3>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 4>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 5>(leds[1], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 6>(leds[1], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 7>(leds[1], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 8>(leds[2], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 9>(leds[2], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 10>(leds[2], NUM_LEDS);

  Bridge.begin();
  server.listenOnLocalhost();
  server.begin();
}

void loop() {
  BridgeClient client = server.accept();
  if (client) {
    process(client);
    client.stop();
  }
  delay(50);
}

void process(BridgeClient client) {
  String command = client.readStringUntil('/');
  if (command == "segment") {
    segmentCommand(client);
  }
  /* if (command == "fade") {
    fadeCommand(client);
    }
    if (command == "pixel") {
    pixelCommand(client);
    } */
}

void segmentCommand(BridgeClient client) {
  int x, y, hue;

  // Read parameters
  x = client.parseInt();
  if (client.read() == '/') {
    y = client.parseInt();
  }
  if (client.read() == '/') {
    hue = client.parseInt();
  }

  // TODO: Implement fade
  int start = y * SEGMENT_LEN;
  client.print(start);
  for (int i = start; i < start + SEGMENT_LEN; i++) {
    client.print(i);
    if (hue == 0) {
      leds[x][i] = CRGB::Black;
    }
    else
      leds[x][i].setHue(hue);
  }
  FastLED.show();
  client.print(F("Colour read as "));
  client.print(hue);

}


