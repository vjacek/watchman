var os = require('os');

// Each Watchman client has a unique identifier
var hostname = os.hostname();
console.log(hostname);
