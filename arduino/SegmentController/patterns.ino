void initStrip()
{
  // all off
  for (int i=0; i < NUM_STRIPS; i++) {
    for (int l=0; l < NUM_LEDS; l++) {
      leds[i][l] = CRGB::Black; 
      FastLED.show(); 
      delay(DELAY/2);
    }
  }
  randomStrip();
}


void randomStrip() {
    for (int i=0; i < NUM_STRIPS; i++) { // strips in controller
      for (int j=0; j < NUM_SEGMENTS; j++) { // segments in strips
        int hue = random(255);
        int sat = 255;
        int val = 255;
        int fade = 0;
        
        // illuminate each strip one by one
        setSegment(i, j, hue, sat, val, fade);
        
  //      int start = j * seglen[i][j]; // SEGMENT_LEN
  //      int finish = start + seglen[i][j];
  //      fill_gradient( leds[i], start, CHSV(0,255,255), finish-1, CHSV(255,255,255), SHORTEST_HUES);
  //      FastLED.show(); 
  
        // wait one second
//        delay(1000);
  
        // led strip off
        //setSegment(i, j, hue, sat, 0, fade);
        
      
//      for (int l=start; l <= finish; l++) {
//        leds[i][l] = CRGB::Black; 
//        FastLED.show(); 
//        delay(DELAY/2);
//      }
    }
  
}
}


void rainbow(BridgeClient client) 
{
  // FastLED's built-in rainbow generator
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    fill_rainbow( leds[i], NUM_LEDS, gHue, 255);
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

void yellow(BridgeClient client)
{
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    for (int l=0; l < NUM_LEDS; l++) {
      client.print(F("Y="));
      client.println(l);
      leds[i][l] = CRGB::Yellow;  
    }
  }
}

void purple(BridgeClient client)
{
  for (int i=0; i < NUM_STRIPS; i++) {
    client.print(F("X="));
    client.println(i);
    for (int l=0; l < NUM_LEDS; l++) {
      client.print(F("Y="));
      client.println(l);
      leds[i][l] = CRGB::Purple;  
    }
  }
}





