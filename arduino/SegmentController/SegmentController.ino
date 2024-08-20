/*
  Dots and Boxes / Colonies installation - Segment Controller
  Written for Arduino Yún
  Francesco Anselmo (August 2017)
  Ben Hussey (December 2023)

  Valid API commands:
  // http://192.168.10.104/arduino/segment/1/0/150/255/255/0/
  "/arduino/segment/X/Y/Hue/Sat/Val/FadeTime"
  "/arduino/test/0"
  "/arduino/off/0"
  "/arduino/rainbow/0"
  "/arduino/red/0"
  "/arduino/green/0"
  "/arduino/blue/0"
  "/arduino/yellow/0"
  "/arduino/purple/0"
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
#define COLOR_ORDER BRG

#define NUM_LEDS 128
//#define SEGMENT_LEN 29 // 1 // Segment len is now defined below dynamically with the seglen array
#define NUM_STRIPS 3 // strips per Yun (usually connected on digital pins 2, 5 and 8, except Yun 2 - see below)
#define NUM_SEGMENTS 4 // segments per strip
#define BRIGHTNESS  250
#define DELAY 20

CRGB leds[NUM_STRIPS][NUM_LEDS];

/* X indicates physical problem
 *     0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
 * l 0 o --- o --- o --- o --- o XXX o XXX o XXX o (1) r
 *   1 X     |     |     |     |     |     |     |
 *   2 o --- o --- o --- o --- o XXX o XXX o --- o (2)
 *   3 X     |     |     |     |     |     |     X
 *   4 o --- o --- o --- o --- o --- o --- o --- o (3)
 *   5 X     |     |     |     |     |     |     X
 *   6 o --- o --- o --- o --- o --- o --- o --- o (4)
 *   7 X     |     |     |     |     |     |     X
 *   8 o --- o --- o --- o --- o --- o --- o --- o (5)
 *    (1)   (2)   (3)   (4)   (5)   (6)   (7)   (8)
 */

// 28 horizontal, 32 vertical = 60 totals

// array of segment lengths
int seglen[][NUM_SEGMENTS] = {

// Yun 1: B4218AF06D0B (controller 0)
// 1.2 row    8l (5): // 30+31+28+30 (checked)
// 1.5 row    4l (3): // 31+31+31+30 (checked)
// 1.8 row    6l (4): // 32+28+28+30 (checked)
//  {30,31,28,30},
//  {31,31,31,30},
//  {32,28,28,30},

// Yun 2: B4218AF069F6 (controller 1) (channel 7 instead of 8, 4 instead of 5)
// 2.2 row    2l (2): //32+28+31+30 (checked)
// 2.4 column 0  (1): //31+30+30+30 (checked)
// 2.7 row    0l (1): //28+28+30+30 (updated 2023)
// row 0l - third segment (col 5) missing due to failure - requires physical fix
  {32,28,31,30},
  {31,30,30,30},
  {28,29,31,30},

// Yun 3: B4218AF069F4 (controller 2)
// 3.2 column 6 (4):  //31+30+30+30 (checked)
// 3.5 column 4 (3):  //31+30+30+30 (updated 2023)
// 3.8 column 2 (2):  //31+30+30+30 (checked)
//  {31,30,30,30},
//  {31,30,30,30},
//  {31,30,30,30},

// Yun 4: B4218AF06C00 (controller 3)
// 4.2 column 12 (7):  31+30+30+30 (checked)
// 4.5 column  8 (5):  31+30+30+30 (checked)
// 4.8 column 10 (6):  31+30+30+30 (updated 2023)
//  {31,30,30,30},
//  {31,30,30,30},
//  {31,30,30,30},

// Yun 5: B4218AF06D1C (controller 4)
// 5.2 column 14 (8):  31+30+31+30 (updated 2023)
// 5.5 row    0r (1):  29+31+30+0  (checked)
// 5.8 row    2r (2):  29+28+31+0  (checked)
//  {31,30,31,30},
//  {29,31,30,0},
//  {29,28,31,0},

// Yun 6: B4218AF06D14 (controller 5)
// 6.2 row    4r (3):  31+32+30+0  (updated 2023)
// 6.5 row    6r (4):  32+28+31+0  (updated 2023)
// 6.8 row    8r (5):  29+28+32+0  (updated 2023)
//  {31,32,30,0},
//  {32,28,31,0},
//  {29,28,32,0},

};

uint8_t gHue = 0; // rotating "base color" used by many of the patterns
int mode = 0; // 0 = off, 1=test, 2=segment, 3=rainbow

void setup() {
  // Sadly these have to be defined manually rather than parametrically...
  FastLED.addLeds<LED_TYPE, 2, COLOR_ORDER>(leds[0], NUM_LEDS);
//  FastLED.addLeds<LED_TYPE, 3>(leds[1], NUM_LEDS);
//  FastLED.addLeds<LED_TYPE, 4>(leds[2], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 4, COLOR_ORDER>(leds[1], NUM_LEDS);
//  FastLED.addLeds<LED_TYPE, 6>(leds[4], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, 7, COLOR_ORDER>(leds[2], NUM_LEDS);
 // FastLED.addLeds<LED_TYPE, 8, COLOR_ORDER>(leds[2], NUM_LEDS);
//  FastLED.addLeds<LED_TYPE, 9>(leds[7], NUM_LEDS);
  //FastLED.addLeds<LED_TYPE, 10>(leds[2], NUM_LEDS);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);

  Bridge.begin();
  //server.listenOnLocalhost();
  server.begin();

  initStrip();
}

void loop() {

//    randomStrip();
  //initStrip();

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
//  if (mode == '0') { // off
//    black(client);
//  } else if (mode == '1') { // test
//
//  } else if (mode == '2') { // segment
//
//  } else if (mode == '3') { // rainbow
//    rainbow(client);
//  }

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
  } else
  if (command == "yellow") {
//    mode = 3;
//    client.println(F("mode=rainbow"));
    yellowCommand(client);
  } else
  if (command == "purple") {
//    mode = 3;
//    client.println(F("mode=rainbow"));
    purpleCommand(client);
  }

}
