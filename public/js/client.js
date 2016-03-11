var ws;

function connect(userName) {
	//TODO: url-encode
	var server = 'wss://codingtest.meedoc.com/ws?username=' + userName;
	ws = new WebSocket(server);
	ws.onopen = function() {
		console.log("connected as " + userName);
		$('#loginModal').modal('hide');
		$('#messageInput').focus();
	};
	ws.onmessage = function(event) {
		//TODO: check if JSON is valid
		var data = $.parseJSON(event.data);
		appendMessage(data.sender, data.message);
	};
};

function appendMessage(sender, message) {
	var divClass = "message";
	if(sender == "me") {
		divClass = divClass + " " + "message-self";
	}
	$( "#messages" ).append( "<div><div class=\"" + divClass + "\">" + sender + ": " + message + "</div></div>" );
	scrollToBottom();
}

function send(message) {
	//TODO: check if connected
	ws.send(message);
};


$(document).ready(function() {
	showModal();

	$('#loginForm').submit(function(e) {
	    e.preventDefault();
		var userName = $('#userName').val();
		connect(userName);
	});

	$('#sendForm').submit(function(e) {
	    e.preventDefault();
		var message = $('#messageInput').val();
		$('#messageInput').val('');
		appendMessage("me", message);
		send(message);
	});
});


$('#messageForm').submit(function(event){
  event.preventDefault();
});


function showModal() {
	$('#loginModal').on('shown.bs.modal', function () {
		$('#userName').focus();
	})

	$('#loginModal').modal('show');
}

function scrollToBottom() {
	$("#messages-container").animate({ scrollTop: $('#messages-container').prop("scrollHeight")}, 1000);

}

