"""
Colonies Pico Controller Code
Ben Hussey - ben@blip2.net - Dec 2024
circup install neopixel adafruit_wiznet5k adafruit_requests asyncio adafruit-circuitpython-httpserver
"""

import board
import busio
import asyncio
import digitalio
import neopixel
import adafruit_connection_manager
from adafruit_wiznet5k.adafruit_wiznet5k import WIZNET5K
from adafruit_httpserver import Server, Request, JSONResponse, Route, GET, POST

animation_mult = 0.05

# Init Networking
cs = digitalio.DigitalInOut(board.GP17)
spi_bus = busio.SPI(board.GP18, MOSI=board.GP19, MISO=board.GP16)

HTTP_PORT = 80
EMPTY = (0, 0, 0)
MAX_PIXELS = 32 * 4
pixels = {0: {"pin": board.GP0}, 1: {"pin": board.GP1}, 2: {"pin": board.GP2}}


class LEDControl:
    def __init__(self):
        self.pixels = pixels
        for i in self.pixels:
            self.pixels[i]["instance"] = neopixel.NeoPixel(
                pixels[i]["pin"],
                MAX_PIXELS,
                brightness=1.0,
                auto_write=False,
                pixel_order="BRG",
            )
        self.fill(EMPTY)

    async def loop(self):
        while True:
            await asyncio.sleep(0)

    def fill(self, color):
        print("filling with: ", color)
        for i in self.pixels:
            self.pixels[i]["instance"].fill(color)
            self.pixels[i]["instance"].show()

    # Fade
    # Fill Segment
    # Test Sequence


class ControlServer:
    def __init__(self, control):
        self.control = control

        # Initialize a requests session
        self.eth = WIZNET5K(spi_bus, cs)
        pool = adafruit_connection_manager.get_radio_socketpool(self.eth)
        self.server = Server(pool)

        print("Chip Version:", self.eth.chip)
        print("MAC Address:", [hex(i) for i in self.eth.mac_address])
        print("IP address is:", self.eth.pretty_ip(self.eth.ip_address))

        self.server.add_routes(
            [
                Route("/", GET, self.hello),
                Route("/change", POST, self.change),
                Route("/clear", POST, self.clear),
            ]
        )

        self.server.start(self.eth.pretty_ip(self.eth.ip_address), port=HTTP_PORT)

    def hello(self, request):
        self.control.fill(EMPTY)
        return JSONResponse(request, {"response": "ok"})

    def change(self, request):
        return JSONResponse(request, {"response": "ok"})

    def clear(self, request):
        return JSONResponse(request, {"response": "ok"})

    async def loop(self):
        while True:
            self.server.poll()
            await asyncio.sleep(0)


async def blink(pin):
    with digitalio.DigitalInOut(pin) as led:
        led.switch_to_output(value=False)
        while True:
            led.value = True
            await asyncio.sleep(1)
            led.value = False
            await asyncio.sleep(1)


async def main():
    control = LEDControl()
    server = ControlServer(control)
    server_task = asyncio.create_task(server.loop())
    led_control = asyncio.create_task(control.loop())
    led_task = asyncio.create_task(blink(board.GP25))
    await asyncio.gather(server_task, led_control, led_task)


asyncio.run(main())
