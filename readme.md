```
$ANDROID_HOME/tools/bin/avdmanager list avds

$ANDROID_HOME/emulator/emulator -avd Nexus5 &

# $ANDROID_HOME/emulator/emulator64-x86 -avd Nexus5_64

$ANDROID_HOME/tools/bin/avdmanager create avd --name "Nexus5" --device 8 --sdcard 1000M --package "system-images;android-23;google_apis;x86"

$ANDROID_HOME/tools/bin/avdmanager create avd --name "Nexus5_64" --device 8 --sdcard 1000M --package "system-images;android-23;google_apis;x86_64"

$ANDROID_HOME/tools/bin/sdkmanager --list

$ANDROID_HOME/tools/bin/sdkmanager --list




# docker commands
```

sudo docker run -it nd bash



sudo docker build -t nd .

# In docker vm
```
/usr/local/android-sdk-linux/tools/bin/avdmanager list avds

/usr/local/android-sdk-linux/emulator/emulator -avd test -noaudio -no-window -gpu off -verbose &
```


# ADB commands
```
adb shell

adb push "russian assimil 1" "/sdcard/Music/assimil/russian assimil 1"

```