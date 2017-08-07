void segmentCommand(BridgeClient client) {
  int x, y;
  int hue, sat, val, fade;
  //String colour;
  //char hex[6];

  mode = 2;
  client.println(F("mode=segment"));

  // Read parameters
  x = client.parseInt();
  if (client.read() == '/') {
    y = client.parseInt();
  }
  if (client.read() == '/') {
    hue = client.parseInt();
  }
  if (client.read() == '/') {
    sat = client.parseInt();
  }
  if (client.read() == '/') {
    val = client.parseInt();
  }
  if (client.read() == '/') {
    fade = client.parseInt();
  }
  if (client.read() == '/') {
//    colour = client.readStringUntil('/');
//    colour.toCharArray(hex, 6);
    
  }

  client.print(F("X="));
  client.println(x);
  client.print(F("Y="));
  client.println(y);
  client.print(F("Hue="));
  client.println(hue);
  client.print(F("Saturation="));
  client.println(sat);
  client.print(F("Value="));
  client.println(val);

  setSegment(x, y, hue, sat, val, fade);

  //  client.print(F("start="));
  //  client.println(start);
  //  client.print(F("length="));
  //  client.println(seglen[x][y]);

 
}



void setSegment(int x, int y, int hue, int sat, int val, int fade) {
   // TODO: Implement fade
  //int start = y * seglen[x][y]; // SEGMENT_LEN if length of segment is fixed - not useful anymore as the number of pixels is different for each segment
  int start = 0;
  for (int j = 0; j < y; j++) {
    start += seglen[x][j];
  }

  // fade to black
//  for (int f = 0; f < fade; f++) {
//    fadeToBlackBy( leds[x], seglen[x][y], 255/fade);
//    delay(50);
//    client.println(f);
//    FastLED.show();
//  }
  for (int i = start; i < start + seglen[x][y]; i++) {
    //client.print(i);
    leds[x][i] = CHSV( hue, sat, val);
    delay(DELAY);
    FastLED.show();
    //leds[x][i] = strtoul(hex, 0, 16);
//     if (hue == 0) {
//       leds[x][i] = CRGB::Black;
//     }
//     else
//       leds[x][i].setHue(hue);
// >>>>>>> master
}
}

