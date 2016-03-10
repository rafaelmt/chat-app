var ws;

function connect(userName) {
	//TODO: url-encode
	var server = 'wss://codingtest.meedoc.com/ws?username=' + userName;
	ws = new WebSocket(server);
	ws.onopen = function() {
		console.log("connected as " + userName);
		$('#loginModal').modal('hide');
	};
	ws.onmessage = function(event) {
		//TODO: check if JSON is valid
		var data = $.parseJSON(event.data);
		appendMessage(data.sender, data.message);
	};
};

function appendMessage(sender, message) {
	$( "#messages" ).append( "<p>" + sender + ": " + message + "</p>" );
}

function send(message) {
	//TODO: check if connected
	ws.send(message);
};

$(document).ready(function() {
	$('#loginModal').modal('show');

	$('#btnConnect').on('click', function() {
		var userName = $('#userName').val();
		connect(userName);
	});

	$('#btnSend').on('click', function() {
		var message = $('#messageInput').val();
		$('#messageInput').val('');
		appendMessage("me", message);
		send(message);
	});
});