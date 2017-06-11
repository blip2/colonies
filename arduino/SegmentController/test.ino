void testCommand(BridgeClient client) {
  int x, y;
  String color;
  char hex[6];

  mode = 1;
  client.println(F("mode=test"));

  // Read parameters
  x = client.parseInt();
  if (client.read() == '/') {
    y = client.parseInt();
  }
  if (client.read() == '/') {
    color = client.readStringUntil('/');
    color.toCharArray(hex, 6);
  }

  // TODO: Implement fade
  int start = y * seglen[x][y];
  client.print(start);
  for (int i = start; i < start + seglen[x][y]; i++) {
    client.print(i);
    leds[x][i] = strtoul(hex, 0, 16);
//     if (hue == 0) {
//       leds[x][i] = CRGB::Black;
//     }
//     else
//       leds[x][i].setHue(hue);
// >>>>>>> master
  }
  FastLED.show();
  client.print(F("Colour read as "));
  client.print(color);

}

