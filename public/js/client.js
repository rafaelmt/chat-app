function connect(userName) {
	//TODO: url-encode
	var server = 'wss://codingtest.meedoc.com/ws?username=' + userName;
	var ws = new WebSocket(server);
	ws.onopen = function() {
		console.log("connected as " + userName);
	};
	ws.onmessage = function(event) {
		//TODO: check if JSON is valid
		var data = $.parseJSON(event.data);
		$( "#messages" ).append( "<p>" + data.message + "</p>" );
	};
};

$(document).ready(function() {
	$('#btnConnect').on('click', function() {
		var userName = $('#userName').val();
		connect(userName);
	});
});