void offCommand(BridgeClient client) {
  mode = 0;
  client.println(F("mode=off"));
//  if (client.read() == '/') {
    black(client);
    FastLED.show();
//  }
}

void redCommand(BridgeClient client) {
  mode = 1;
  client.println(F("mode=red"));
//  if (client.read() == '/') {
    red(client);
    FastLED.show();
//  }
}

void greenCommand(BridgeClient client) {
  mode = 1;
  client.println(F("mode=red"));
//  if (client.read() == '/') {
    green(client);
    FastLED.show();
//  }
}

void blueCommand(BridgeClient client) {
  mode = 1;
  client.println(F("mode=blue"));
//  if (client.read() == '/') {
    red(client);
    FastLED.show();
//  }
}

void rainbowCommand(BridgeClient client) {
  mode = 3;
  client.println(F("mode=red"));
  rainbow(client);
  FastLED.show();
}

