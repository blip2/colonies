/*
  Dots and Boxes Segment Controller
  Written for Arduino Yún

  Valid API commands:
  "/arduino/segment/X/Y/Hue/Sat/Val/"
  "/arduino/test/X/Y/0" 
  "/arduino/off/0" 
  "/arduino/rainbow/0" 
  "/arduino/red/0" 
  "/arduino/green/0" 
  "/arduino/blue/0" 
  "/arduino/fade/X/Y/HHSSVV/HHSSVV/t" (WIP)
  "/arduino/pixel/X/Y/Z/HHSSVV" (WIP)
  where H, X, Y, Z are integers
  H - Hue from 0 to 255
  X - Strip from 0 to 2
  Y - Segment from 0 to 3
  Z - Pixel from 0 to 31

*/

#include "FastLED.h"

FASTLED_USING_NAMESPACE

#if defined(FASTLED_VERSION) && (FASTLED_VERSION < 3001000)
#warning "Requires FastLED 3.1 or later; check github for latest code."
#endif


#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>

BridgeServer server;

// LED Strip Configuration
#define LED_TYPE    WS2811
#define COLOR_ORDER RGB

#define NUM_LEDS 4 //128
#define SEGMENT_LEN 1 // 1
#define NUM_STRIPS 8 // strips per Yun
#define NUM_SEGMENTS 4 // segments per strip
#define BRIGHTNESS  96

CRGB leds[NUM_STRIPS][NUM_LEDS];

// array of segment lengths
//int seglen[][NUM_SEGMENTS] = {
//  {32,32,32,32},
//  {32,32,32,32},
//  {32,32,32,32},
//  {32,32,32,32},
//  {32,32,32,32},
//  {32,32,32,32},
//  {32,32,32,32},
//  {32,32,32,32},
//};

int seglen[][NUM_SEGMENTS] = {
  {1,1,1,1},
  {1,1,1,1},
  {1,1,1,1},
  {1,1,1,1},
  {1,1,1,1},
  {1,1,1,1},
  {1,1,1,1},
  {1,1,1,1},
};

uint8_t gHue = 0; // rotating "base color" used by many of the patterns
int mode = 0; // 0 = off, 1=test, 2=segment, 3=rainbow

void setup() {
  // Sadly these have to be defined manually rather than parametrically...
  FastLED.addLeds<LED_TYPE, 2>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 3>(leds[1], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 4>(leds[2], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 5>(leds[3], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 6>(leds[4], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 7>(leds[5], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 8>(leds[6], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 9>(leds[7], NUM_LEDS);
  //FastLED.addLeds<LED_TYPE, 10>(leds[2], NUM_LEDS);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);

  Bridge.begin();
  server.listenOnLocalhost();
  server.begin();
}

void loop() {
  BridgeClient client = server.accept();
  if (client) {
    process(client);
    client.stop();
  } else if (mode == '3') { // rainbow
    rainbow(client);  
  }
  
  // do some periodic updates
  EVERY_N_MILLISECONDS( 20 ) { gHue++; } // slowly cycle the "base color" through the rainbow
  //EVERY_N_SECONDS( 10 ) { nextPattern(); } // change patterns periodically

  delay(50);
  if (mode == '0') { // off
    black(client);
  } else if (mode == '1') { // test
    
  } else if (mode == '2') { // segment
    
  } else if (mode == '3') { // rainbow
    rainbow(client);  
  }
  
}

void process(BridgeClient client) {
  String command = client.readStringUntil('/');
  if (command == "segment") {
//    mode = 2;
//    client.println(F("mode=segment"));
    segmentCommand(client);
  } else
  /*
  if (command == "fade") {
    fadeCommand(client);
  }
  *
   /*
    if (command == "pixel") {
    pixelCommand(client);
    }
    */ 
  if (command == "test") {
//    mode = 1;
//    client.println(F("mode=test"));
    testCommand(client);
  } else
  if (command == "off") {
//    mode = 0;
//    client.println(F("mode=test"));
    offCommand(client);
  } else
  if (command == "rainbow") {
//    mode = 3;
//    client.println(F("mode=rainbow"));
    rainbowCommand(client);
  } else
  if (command == "red") {
//    mode = 3;
//    client.println(F("mode=rainbow"));
    redCommand(client);
  } else
  if (command == "green") {
//    mode = 3;
//    client.println(F("mode=rainbow"));
    greenCommand(client);
  } else
  if (command == "blue") {
//    mode = 3;
//    client.println(F("mode=rainbow"));
    blueCommand(client);
  } 
  
}



