#!/bin/bash

echo "no" | /usr/local/android-sdk/tools/emulator64-${EMU} -avd test -noaudio -no-window -gpu off -verbose -qemu -usbdevice tablet -vnc :0
