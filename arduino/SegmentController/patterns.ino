void rainbow(BridgeClient client) 
{
  // FastLED's built-in rainbow generator
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    fill_rainbow( leds[i], NUM_LEDS, gHue, 7);
  }
}

void black(BridgeClient client)
{
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    for (int l=0; l < NUM_LEDS; l++) {
      client.print(F("Y="));
      client.println(l);
      leds[i][l] = CRGB::Black;  
    }
  }
}

void red(BridgeClient client)
{
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    for (int l=0; l < NUM_LEDS; l++) {
      client.print(F("Y="));
      client.println(l);
      leds[i][l] = CRGB::Red;  
    }
  }
}

void blue(BridgeClient client)
{
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    for (int l=0; l < NUM_LEDS; l++) {
      client.print(F("Y="));
      client.println(l);
      leds[i][l] = CRGB::Blue;  
    }
  }
}

void green(BridgeClient client)
{
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    for (int l=0; l < NUM_LEDS; l++) {
      client.print(F("Y="));
      client.println(l);
      leds[i][l] = CRGB::Green;  
    }
  }
}





