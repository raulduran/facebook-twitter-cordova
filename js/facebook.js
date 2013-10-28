// APP FACEBOOK ID
var appId = '174262222776122';
//CONFIGURE URL IN FACEBOOK APP->Internet por celular->Mobile Site URL
var redirectUrl = 'http://ntrenat.elnucleo.org/ok.html';
// APP FACEBOOK PERMISSIONS
var permissions = 'email,publish_actions';

var facebook = {

	//Function facebook login
	onFacebookLogin: function(option) {

		var authorize_url  = "https://m.facebook.com/dialog/oauth?";
			authorize_url += "client_id=" + appId;
			authorize_url += "&redirect_uri=" + redirectUrl;
			authorize_url += "&display=touch";
			authorize_url += "&response_type=token";
			authorize_url += "&type=user_agent";
			
		if(permissions !== '') {
			authorize_url += "&scope=" + permissions;
		}

		option = (option)?option:'location=no';

		var appInBrowser = window.open(authorize_url, '_blank', option);

		appInBrowser.addEventListener('loadstart', function(location) {

			if (location.url.indexOf("access_token") !== -1) {
				// Success
				var access_token = location.url.match(/access_token=(.*)$/)[1].split('&expires_in')[0];
				window.localStorage.setItem('facebook_accessToken', access_token);
				appInBrowser.close();
			}

			if (location.url.indexOf("error_reason=user_denied") !== -1) {
				// User denied
				window.localStorage.setItem('facebook_accessToken', null);
				appInBrowser.close();
			}
		});
	},

	//Function logout
	onFacebookLogout: function() {
		var logout_url = encodeURI("https://www.facebook.com/logout.php?next=" + redirectUrl + "&access_token=" + window.localStorage.getItem('facebook_accessToken'));
		var appInBrowser = window.open(logout_url, '_blank', 'hidden=yes,location=no');
		
		appInBrowser.addEventListener('loadstart', function(location) {
			if(location.url == logout_url) {
				// Do nothing
			}
			else if(location.url === redirectUrl + '#_=_' || location.url === redirectUrl) {
				window.localStorage.setItem('facebook_accessToken', null);
				appInBrowser.close();
			}
		});
	},

	//Function check With Login
	onFacebookCheckWithLogin: function() {
		var access_token = window.localStorage.getItem('facebook_accessToken');
		var url = "https://graph.facebook.com/me?access_token=" + access_token;
		$.getJSON(url, function() {
			facebook.onFacebookLogin('hidden=yes,location=no');
		})
		.error(function() {
			facebook.onFacebookLogin();
		});
	},

	//Function get info
	onFacebookGetInfo: function() {
		if(window.localStorage.getItem('facebook_accessToken') === null) {
			return false;
		}
		var url = "https://graph.facebook.com/me?access_token=" + window.localStorage.getItem('facebook_accessToken');
		$.getJSON(url, function(data) {
			window.localStorage.setItem('facebook_uid', data.id);
		})
		.error(function() {
			window.localStorage.setItem('facebook_accessToken', null);
			window.localStorage.setItem('facebook_uid', null);
		});
	},

	/*
	Function post feed
	Param post object:
	{message: 'Lorem lipsum',
	link: 'http://ntrenat.elnucleo.org',
	picture: 'http://ntrenat.elnucleo.org/logo.png',
	name: 'Esto es un nombre',
	caption: 'ntrenat.elnucleo.org',
	description: 'lorem lipsum'}
	*/
	onFacebookPostFeed: function(post) {
		if(window.localStorage.getItem('facebook_accessToken') === null) {
			return false;
		}
		var url = "https://graph.facebook.com/me/feed?access_token="+window.localStorage.getItem('facebook_accessToken');
		$.post(url, post)
		.error(function() {
			window.localStorage.setItem('facebook_accessToken', null);
			window.localStorage.setItem('facebook_uid', null);
		});
	}
};