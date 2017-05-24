# Automatically locate the Castle server
# Port is always fixed at 8888, but DHCP network may change IPs

# Start the video camera and send each image to a local UNIX domain socket

# -o -      : Write to stdout
# -t 0      : Capture indefinitely
# -w xxx    : Image width
# -h xxx    : Image height
# -fps 10   : Capture Frames Per Second
# -g 1      : Make every frame a key frame (TODO: test if this is still needed, could reduce frame size if not needed)
# -fl       : Flush buffer after every capture, reduces latency and makes image splitting cleaner
# -cd MJPEG : Motion JPEG formats capture frames as JPEG images

raspivid -o - -t 0 -w 1024 -h 768 -fps 10 -g 1 -fl -cd MJPEG | nc -U "/tmp/watchman.sock"
