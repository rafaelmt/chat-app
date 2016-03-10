var ws;

function connect(userName) {
	//TODO: url-encode
	var server = 'wss://codingtest.meedoc.com/ws?username=' + userName;
	ws = new WebSocket(server);
	ws.onopen = function() {
		console.log("connected as " + userName);
		$('#login').slideUp();
	};
	ws.onmessage = function(event) {
		//TODO: check if JSON is valid
		var data = $.parseJSON(event.data);
		appendMessage(data.message);
	};
};

function appendMessage(message) {
	$( "#messages" ).append( "<p>" + message + "</p>" );
}

function send(message) {
	//TODO: check if connected
	ws.send(message);
};

$(document).ready(function() {
	$('#btnConnect').on('click', function() {
		var userName = $('#userName').val();
		connect(userName);
	});

	$('#btnSend').on('click', function() {
		var message = $('#messageInput').val();
		$('#messageInput').val('');
		appendMessage(message);
		send(message);
	});
});