import board
import digitalio
import storage
switch = digitalio.DigitalInOut(board.GP13)
switch.direction = digitalio.Direction.INPUT
switch.pull = digitalio.Pull.UP
storage.remount("/", readonly=switch.value)