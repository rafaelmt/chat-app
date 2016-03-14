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
	name = encodeURIComponent(userName);
	var serverUrl = endpoint + "?username=" + userName;
	connect(serverUrl, onOpen, onMessage, onClose);
}

function onOpen() {
	$('#loginModal').modal('hide');
	$('#messageInput').focus();
}

function onMessage(event) {
	try {
		var data = $.parseJSON(event.data);
		appendMessage(data);
	} catch (e) {
		console.log("Invalid message received");
		return;
	}
}

function onClose() {
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

function appendMessage(message) {
	var messageContainerDiv = $('<div/>').addClass('message-container');
	createMessageDiv(message, messageContainerDiv);
	$('#messages').append(messageContainerDiv);
	scrollToBottom();
}

function createMessageDiv(message, messageContainerDiv) {
	var messageDiv = $('<div/>').addClass('message').text(message.message);
	var messageSenderDiv = $('<div/>').addClass('message-sender');
	if(message.sender == "me") {
		messageDiv.addClass("message-self");
		messageContainerDiv.addClass("message-container-self");
		messageSenderDiv.append(messageDiv);
	} else {
		var avatarImg = $('<img>',{src:'images/placeholder.png'}).addClass('avatar');
		messageContainerDiv.append(avatarImg);
		messageSenderDiv.append($('<div/>').text(message.sender + " says:").addClass('sender'));
		messageSenderDiv.append(messageDiv);
		updateAvatar(message.sender, function(url){
		    avatarImg.attr("src", url);
		});
	}
	messageContainerDiv.append(messageSenderDiv);
}

function send(message) {
	//TODO: check if connected
	ws.send(message);
};

function updateAvatar(sender, callback) {
	$.ajax({
	  method: "GET",
	  url: "/avatar",
	  data: { name: sender }
	})
	  .done(function( msg ) {
		if(msg.url) {
			callback(msg.url);
		}
	});
}

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
		if(message != "") {
			$('#messageInput').val('');
			appendMessage({sender: "me", message: message});
			send(message);
		}
	});

    $('#btnLogout').on('click', function() {
		showLogoutModal();
    });

    $('#btnConfirmLogout').on('click', function() {
		logout();
		$('#logoutModal').modal('hide');
		showLoginModal();
    });

    $('#btnDismissLogout').on('click', function() {
		$('#logoutModal').modal('hide');
    });

	$('#messageInput').on('keydown', function(event) {
		if (event.keyCode == 13) {
			if (!event.shiftKey) {
				event.preventDefault();
				$('#messageInput').submit();
			}
		}
	});
});


$('#messageForm').submit(function(event){
  event.preventDefault();
});


function showConnectingButton() {
	$('#btnConnect').prop('disabled', true);
	$('#btnConnect').html("Connecting");
	$('#btnConnect').append($("<span/>").addClass("spinner-loading").addClass("glyphicon").addClass("glyphicon-refresh").addClass("glyphicon-refresh-animate"));
}

function restoreLoginButton() {
	$('#btnConnect').prop('disabled', false);
	$('#btnConnect').html("Go!");
}

function showLoginModal() {
	$('#loginModal').on('shown.bs.modal', function () {
		$('#userName').focus();
	})
	restoreLoginButton();
	$('#loginModal').modal( {backdrop: 'static', keyboard: false});
};


function showLogoutModal() {
	$('#logoutModal').modal('show');
};

function scrollToBottom() {
	$("#messages-container").animate({ scrollTop: $('#messages-container').prop("scrollHeight")}, 100);

};


