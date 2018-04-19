# Android development environment for ubuntu.
# version 0.0.5

FROM ubuntu

RUN echo "debconf shared/accepted-oracle-license-v1-1 select true" | debconf-set-selections && \
    echo "debconf shared/accepted-oracle-license-v1-1 seen true" | debconf-set-selections

# Update packages
# software-properties-common 
RUN apt-get -y update && \
    apt-get -y install software-properties-common bzip2 curl && \
    add-apt-repository ppa:webupd8team/java && \
    apt-get update && \
    apt-get -y install oracle-java8-installer && \  
    apt-get -y install git-core expect unzip && \
    apt-get -y install pulseaudio

    #rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs 

RUN mkdir /usr/local/android-sdk-linux
WORKDIR /usr/local/android-sdk-linux

ENV SDK_TOOLS_ZIP_NAME sdk-tools-linux-3859397.zip
RUN wget https://dl.google.com/android/repository/${SDK_TOOLS_ZIP_NAME}

RUN unzip ${SDK_TOOLS_ZIP_NAME} && rm ${SDK_TOOLS_ZIP_NAME} && chown -R root:root /usr/local/android-sdk-linux/

# Add android tools and platform tools to PATH
ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV PATH $PATH:$ANDROID_HOME/tools/bin
ENV PATH $PATH:$ANDROID_HOME/tools
ENV PATH $PATH:$ANDROID_HOME/platform-tools
ENV PATH /opt/tools:${PATH}
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle
# ENV LD_LIBRARY_PATH /usr/local/android-sdk-linux/emulator/lib64/qt/lib

# Autoaccept all android SDK licenses  
RUN yes | sdkmanager --licenses 


ENV ANDROID_PLATFORM_VERSION 23
#ENV ANDROID_EMULATOR_PACKAGE "system-images;android-$ANDROID_PLATFORM_VERSION;google_apis;x86"
ENV ANDROID_EMULATOR_PACKAGE "system-images;android-$ANDROID_PLATFORM_VERSION;google_apis;armeabi-v7a"


RUN sdkmanager --verbose  "build-tools;25.0.2" "platforms;android-23"  "extras;android;m2repository" "extras;google;m2repository"  "$ANDROID_EMULATOR_PACKAGE" "emulator"

WORKDIR "/vocab-nativescript"

COPY package.json ./

RUN npm i
RUN echo n | npm install -g nativescript
RUN tns usage-reporting disable && tns error-reporting disable 

#COPY *.json *.js *.ts ./
#COPY app/vendor* ./app/
#COPY app/App_Resources ./app/App_Resources

#RUN tns platform add android

COPY app ./app

#RUN tns build android

#RUN mkdir /sdcard

# Create fake keymap file
#RUN mkdir /usr/local/android-sdk/tools/keymaps && \
#    touch /usr/local/android-sdk/tools/keymaps/en-us

# Install custom tools
#COPY tools /opt/tools

#RUN android-avdmanager-create "avdmanager --verbose create avd --package \"$ANDROID_EMULATOR_PACKAGE\" --name test --abi \"google_apis/armeabi-v7a\"" 
#RUN android-avdmanager-create "avdmanager --verbose create avd --package \"$ANDROID_EMULATOR_PACKAGE\" --name test --abi \"google_apis/x86\""


RUN npm run tsc

# apt-get install qt5-default
# /usr/local/android-sdk-linux/emulator/emulator64-arm -avd test -noaudio -no-window -gpu off -verbose &
# /usr/local/android-sdk-linux/emulator/emulator -avd test -noaudio -no-window -gpu off -verbose &

# tns test android --justlaunch