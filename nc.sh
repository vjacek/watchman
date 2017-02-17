#raspivid -o - -t 0 -w 1280 -h 1024 -b 1000000 -fps 24 -cd H264 | ncat -l -k -v -4 8888

#raspivid -o - -t 0 -w 1280 -h 1024 -b 1000000 -fps 24 -cd H264 -ih | ncat -v 192.168.0.106 8888

#raspivid -o - -t 0 -w 480 -h 320 -fps 24  -fl -cd MJPEG | node send.js

raspivid -o - -t 0 -w 1024 -h 768 -fps 24 -g 1 -fl -cd MJPEG -vf | node send.js

# works but taking still images is too slow and frequently drops frames or has to restart
#raspistill -o - -w 640 -h 480 -q 5 -tl 100 -t 0 -th 0:0:0 -vf | node send.js

#raspivid -o test.mjpeg -t 5 -w 640 -h 480 -b 500000 -fps 24 -cd MJPEG


#while true
#do
#    echo 'capturing and sending frame'
#    raspistill -o - -t 0 -w 640 -h 480 -e png | node send.js
#    
#    sleep 1
#done

# to receive this video:
# nc 192.168.0.102 8888 > ~/Downloads/test.h264
