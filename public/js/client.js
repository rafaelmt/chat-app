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
	$("div.message").remove();
}

function appendMessage(sender, message) {
	var divClass = "message";
	if(sender == "me") {
		divClass = divClass + " " + "message-self";
	}
	//TODO: re-write this
	$( "#messages" ).append( "<div><div class=\"" + divClass + "\">" + sender + ": " + message + "</div></div>" );
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
	$("#messages-container").animate({ scrollTop: $('#messages-container').prop("scrollHeight")}, 1000);

};


