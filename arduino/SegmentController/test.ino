void testCommand(BridgeClient client) {
  int x, y;
  String color;
  char hex[6];

  mode = 1;
  client.println(F("mode=test"));

   for(int i = 0; i < NUM_LEDS; i++) {
    // set our current dot to blue
    leds[0][i] = CRGB::Blue;
    leds[1][i] = CRGB::Blue;
    leds[2][i] = CRGB::Blue;
    FastLED.show();
    // clear our current dot before we move on
    //leds[i] = CRGB::Black;
    delay(DELAY);
  }

  for(int i = NUM_LEDS-1; i >= 0; i--) {
    // set our current dot to green
    leds[0][i] = CRGB::Green;
    leds[1][i] = CRGB::Green;
    leds[2][i] = CRGB::Green;
    FastLED.show();
    // clear our current dot before we move on
    //leds[i] = CRGB::Black;
    delay(DELAY);
  }

  for(int i = 0; i < NUM_LEDS; i++) {
    // set our current dot to yellow
    leds[0][i] = CRGB::Yellow;
    leds[1][i] = CRGB::Yellow;
    leds[2][i] = CRGB::Yellow;
    FastLED.show();
    // clear our current dot before we move on
    //leds[i] = CRGB::Black;
    delay(DELAY);
  }

  for(int i = NUM_LEDS-1; i >= 0; i--) {
    // set our current dot to black
    leds[0][i] = CRGB::Black;
    leds[1][i] = CRGB::Black;
    leds[2][i] = CRGB::Black;
    FastLED.show();
    // clear our current dot before we move on
    //leds[i] = CRGB::Black;
    delay(DELAY);
  }
  FastLED.show();
  

}

