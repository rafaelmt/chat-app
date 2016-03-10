function connect() {
	var userName = "test";
	//TODO: url-encode
	var server = 'wss://codingtest.meedoc.com/ws?username=' + userName;
	var ws = new WebSocket(server);
	ws.onopen = function() {
		console.log("yay");
	};
}
