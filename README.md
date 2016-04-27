# Watchman
Keep an eye on your kingdom.



## Setup 

### Install the OpenCV image processing libary
`$ sudo apt-get install libopencv-dev python-opencv`


### Install required NodeJS packages
`$ npm install`


## Running

### Start the Watchman server
`$ forever start watchman.js`

### Start each Client Camera
`$ forever start camera.js`

### Website
Hosted by the watchman server

`http://localhost:8080`
