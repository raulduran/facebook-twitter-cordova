// Settings
var appId = '174262222776122';
var redirectUrl = 'http://ntrenat.elnucleo.org/ok.html';
var permissions = 'email,publish_actions';

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', app.onDeviceReady, false);
	},

	onDeviceReady: function() {
		facebook.onFacebookLogin();
	}
};