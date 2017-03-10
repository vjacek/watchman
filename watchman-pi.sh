# Automatically locate the Castle server
# Port is always fixed at 8888, but DHCP network may change IPs

#!/bin/bash

subnet="192.168.0."
ip=200
max=210
port=":8888"
path="/locate"

echo "Watchman startup... "
echo "Looking for Castle..."

while (("$ip" < "$max"))
do
    address="$subnet$ip$port$path"
    echo "Looking for Castle at $subnet$ip"
    result=$(curl -s --connect-timeout 1 $address)
    if [ "$result" == "true" ]
    then
        castleIP="$subnet$ip"
        echo "Found Castle at $subnet$ip"
        break
    fi
    ((ip++))
done

# Start the video camera and send each image to the Castle server

# -o -      : Write to stdout
# -t 0      : Capture indefinitely
# -w xxx    : Image width
# -h xxx    : Image height
# -fps 10   : Capture Frames Per Second
# -g 1      : Make every frame a key frame (TODO: test if this is still needed, could reduce frame size if not needed)
# -fl       : Flush buffer after every capture, reduces latency and makes image splitting cleaner
# -cd MJPEG : Motion JPEG formats capture frames as JPEG images
# -vf       : Flip image vertically (camera is mounted upside down)
#raspivid -o - -t 0 -w 1024 -h 768 -fps 10 -g 1 -fl -cd MJPEG -vf | node send.js $castleIP
raspivid -o - -t 0 -w 1024 -h 768 -fps 10 -g 1 -fl -cd MJPEG -vf | nc -U "/tmp/watchman.sock"
