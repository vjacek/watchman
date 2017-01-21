# Watchman
Keep an eye on your kingdom.



## Setup

### Install the latest version of NodeJS

```
$ sudo apt-get install nodejs npm


$ sudo npm cache clean -f
$ sudo npm install -g n
$ sudo n stable

$ sudo ln -sf /usr/local/n/versions/node/<VERSION>/bin/node /usr/bin/node
```


### ??? Might not be needed ??? Create a symbolic link to the node path
`$ chmod a+r /path/to/node -R`
`$ cd /usr/lib`
`$ sudo ln -s /path/to/node node`

### Install the OpenCV image processing libary
`$ sudo apt-get install libopencv-dev python-opencv`
or
`$ brew tap homebrew/sciene`
`$ brew install opencv3`

### Clone Watchman
`$ git clone https://github.com/vjacek/watchman.git`

### Install required NodeJS packages
``
`$ npm install`


## Running

### Start the Watchman server to receive video
`$ forever start watchman.js`

### Start each Client Camera
`$ forever start camera.js`

### Website
Hosted by the watchman server

`http://localhost:8080`
