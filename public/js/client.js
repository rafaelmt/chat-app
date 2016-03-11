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


$(document).ready(function() {
	showLoginModal();

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


