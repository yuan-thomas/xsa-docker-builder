var approuter = require('@sap/approuter');

var ar = approuter();

 
MEMORY_LIMIT = process.env.MEMORY_LIMIT;
PORT = process.env.PORT;
XSA_APPLICATION_DOCKER_PORT = process.env.XSA_APPLICATION_DOCKER_PORT;
XSA_INSTANCE_ID = process.env.XSA_INSTANCE_ID;
DOCKER_ARG = process.env.DOCKER_ARG || '--init';
XSA_APPLICATION_DOCKER_IMAGE = process.env.XSA_APPLICATION_DOCKER_IMAGE;
DOCKER_IMAGE_CMD = process.env.DOCKER_IMAGE_CMD || '';

child_process = require('child_process');
docker = child_process.spawn('docker', ['run', '--rm', '--init', `--memory=${MEMORY_LIMIT}`, `-p`, `127.0.0.1::${XSA_APPLICATION_DOCKER_PORT}`, '--env', 'VCAP_SERVICES', '--env', 'VCAP_APPLICATION', '--env-file', 'env.list', '--name', `${XSA_INSTANCE_ID}`, `${DOCKER_ARG}`, `${XSA_APPLICATION_DOCKER_IMAGE}`, `${DOCKER_IMAGE_CMD}`]);

docker.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

docker.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

docker.on('exit', function (code, signal) {
  console.log('Docker process exited with ' +
              `code ${code} and signal ${signal}`);
  ar.close();
});

process.on('exit', () => {
  console.log("process.exit() method is fired, approuter process ending.");
  child_process.execSync(`docker stop ${XSA_INSTANCE_ID}`)
});


var startServer = function() {
	regex = /:[0-9]*/g;
	port = child_process.execSync(`docker port ${XSA_INSTANCE_ID}`).toString().match(regex)[0];
	
	console.log('Step 2 - Port from the container: '+port);
	
	//process.env.COOKIES = '{ "SameSite":"None" }';
	
	process.env.destinations = `[
	  {
	    "name" : "docker",
	    "url" : "http://localhost${port}",
	    "forwardAuthToken" : false,
	    "setXForwardedHeaders" : true,
	    "strictSSL" : false
	  }
	]`;

	console.log(process.env.destinations);

	ar.beforeRequestHandler.use('/', function myMiddleware(req, res, next) {
	  req.headers['X-User'] = req.user.id;
	  req.headers['X-Role'] = 'user|admin';
	//  console.log(req.user.scopes);
	  next();
	});
	ar.start();
}


var sleep5s = function () {
    console.log('Step 1 - Wait for 5 seconds then read port from the container');
    setTimeout(startServer, 5000);
}

sleep5s();
