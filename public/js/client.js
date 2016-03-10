function connect(userName) {
	//TODO: url-encode
	var server = 'wss://codingtest.meedoc.com/ws?username=' + userName;
	var ws = new WebSocket(server);
	ws.onopen = function() {
		console.log("connected as " + userName);
	};
};

$(document).ready(function() {
	$('#btnConnect').on('click', function() {
		var userName = $('#userName').val();
		connect(userName);
	});
});