var oauth;
var requestParams;
var options = {
	consumerKey: 'e3MML4kl7nc3ILJJWGvphA',
	consumerSecret: '060ZSw2whRDsmiDqRnQrrzW9TWiFwjiGTKZsUBDkGs',
	callbackUrl: "http://ntrenat.elnucleo.org/ok.html"
};
var twitterKey = "twitter_token";

var twitter = {

	login: function() {
		if(localStorage.getItem(twitterKey) !== null){
			var storedAccessData, rawData = localStorage.getItem(twitterKey);

			storedAccessData = JSON.parse(rawData);
			options.accessTokenKey = storedAccessData.accessTokenKey;
			options.accessTokenSecret = storedAccessData.accessTokenSecret;
					 
			oauth = OAuth(options);
			oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true');
		}
		else {
			// we have no data for save user
			oauth = OAuth(options);
			oauth.get('https://api.twitter.com/oauth/request_token', function(data) {
				requestParams = data.text;
				var appInBrowser = window.open('https://api.twitter.com/oauth/authorize?'+data.text, '_blank', 'hidden=no,location=no');
				appInBrowser.addEventListener('loadstart', function(location) {
					var loc = location.url;
					if (loc.indexOf(options.callbackUrl+"?") >= 0) {
						 
						// Parse the returned URL
						var index, verifier = '';
						var params = loc.substr(loc.indexOf('?') + 1);
						 
						params = params.split('&');
						for (var i = 0; i < params.length; i++) {
							var y = params[i].split('=');
							if(y[0] === 'oauth_verifier') {
								verifier = y[1];
							}
						}

						// Here we are going to change token for request with token for access
						oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&'+requestParams, function(data) {
							var accessParams = {};
							var qvars_tmp = data.text.split('&');
							for (var i = 0; i < qvars_tmp.length; i++) {
								var y = qvars_tmp[i].split('=');
								accessParams[y[0]] = decodeURIComponent(y[1]);
							}

							// Saving token of access in Local_Storage
							var accessData = {};
							accessData.accessTokenKey = accessParams.oauth_token;
							accessData.accessTokenSecret = accessParams.oauth_token_secret;
							localStorage.setItem(twitterKey, JSON.stringify(accessData));

							//CLOSE
							appInBrowser.close();
						});
					}
				});
			});
		}
	},

	tweet:function(object) {
		var storedAccessData, rawData = localStorage.getItem(twitterKey);
				 
		storedAccessData = JSON.parse(rawData);
		options.accessTokenKey = storedAccessData.accessTokenKey;
		options.accessTokenSecret = storedAccessData.accessTokenSecret;
				 
		oauth = OAuth(options);
		oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true', function(data) {
			oauth.post('https://api.twitter.com/1.1/statuses/update.json', object);
		});
	},

	logout: function() {
		options.accessTokenKey = null;
		options.accessTokenSecret = null;
		window.localStorage.removeItem(twitterKey);
	}

};