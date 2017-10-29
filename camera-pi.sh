# Start the video camera and send each image to a local UNIX domain socket
# The UNIX domain socket assembles JPEG files and streams to server

# -o -      : Write to stdout, for piping to nc
# -t 0      : Capture indefinitely
# -w 1024   : Image width
# -h 768    : Image height
# -fps 10   : Capture Frames Per Second
# -g 1      : Make every frame a key frame (TODO: test if this is still needed, could reduce frame size if not needed)
# -fl       : Flush buffer after every capture, reduces latency and makes image splitting cleaner
# -cd MJPEG : Motion JPEG formats capture frames as JPEG images

raspivid -o - -t 0 -w 1024 -h 768 -fps 10 -g 1 -fl -cd MJPEG | nc -U "/tmp/watchman.sock"
