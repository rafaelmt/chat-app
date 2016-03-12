var ws;

var name;
var endpoint = 'wss://codingtest.meedoc.com/ws';

function connect(serverUrl, onOpen, onMessage, onClose) {
	ws = new WebSocket(serverUrl);
	ws.onopen = onOpen;
	ws.onmessage = onMessage;
	ws.onclose = onClose;
}

function login(userName) {
	name = userName;
	var serverUrl = endpoint + "?username=" + userName;
	connect(serverUrl, onOpen, onMessage, onClose);
}

function onOpen() {
	$('#loginModal').modal('hide');
	$('#messageInput').focus();
}

function onMessage() {
	//TODO: check if JSON is valid
	var data = $.parseJSON(event.data);
	appendMessage(data.sender, data.message);
}

function onClose() {
	console.log('connection lost, reconnecting');
	disableInput();
	setTimeout(function(){connect(ws.url, onReconnect, ws.onmessage, ws.onclose)}, 3000); 
}

function onReconnect() {
	enableInput();
	$('#messageInput').focus();
}


function logout() {
	disconnect();
	cleanMessages();
	showLoginModal();
}

function disconnect() {
	ws.close();
};

function cleanMessages() {
	$("div.message-container").remove();
}

function appendMessage(sender, message) {
	var messageDiv = $('<div/>').addClass('message').text(message);
	var messageContainerDiv = $('<div/>').addClass('message-container');
	if(sender == "me") {
		messageDiv.addClass("message-self");
		messageContainerDiv.addClass("message-container-self");
	} else {
		messageContainerDiv.append($('<div/>').text(sender + " says:").addClass('sender'));
	}

	messageContainerDiv.append(messageDiv);

	$('#messages').append(messageContainerDiv);
	scrollToBottom();
}

function send(message) {
	//TODO: check if connected
	ws.send(message);
};

function disableInput() {
	$("#messageInput").prop('disabled', true);
	$("#btnSend").prop('disabled', true);
}

function enableInput() {
	$("#messageInput").prop('disabled', false);
	$("#btnSend").prop('disabled', false);
}


$(document).ready(function() {
	showLoginModal();

	$('#loginForm').submit(function(e) {
	    e.preventDefault();
	    showConnectingButton();
		var userName = $('#userName').val();
		login(userName);
	});

	$('#sendForm').submit(function(e) {
	    e.preventDefault();
		var message = $('#messageInput').val();
		$('#messageInput').val('');
		appendMessage("me", message);
		send(message);
	});

    $('#btnLogout').on('click', function() {
		showLogoutModal();
    });

    $('#btnConfirmLogout').on('click', function() {
		logout();
		$('#logoutModal').modal('hide');
    });

    $('#btnDismissLogout').on('click', function() {
		$('#logoutModal').modal('hide');
		showLoginModal();
    });
});


$('#messageForm').submit(function(event){
  event.preventDefault();
});

function showConnectingButton() {
	$('#btnConnect').prop('disabled', true);
	$('#btnConnect').html("Connecting");
	$('#btnConnect').append($("<span/>").addClass("glyphicon").addClass("glyphicon-refresh").addClass("glyphicon-refresh-animate"));
}

function showLoginModal() {
	$('#loginModal').on('shown.bs.modal', function () {
		$('#userName').focus();
	})
	$('#loginModal').modal('show');
};

function showLogoutModal() {
	$('#logoutModal').modal('show');
};

function scrollToBottom() {
	$("#messages-container").animate({ scrollTop: $('#messages-container').prop("scrollHeight")}, 100);

};


