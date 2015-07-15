!function(env) {
	'use strict';
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = raftNetwork;
	else if (typeof define === "function" && define.amd) define(raftNetwork);
	else env.raftNetwork = raftNetwork();

	function raftNetwork(){

		return localNetworkDecorator;

		function localNetworkDecorator(model, Class) {
			Class.prototype.testNetwork = function (test) {
				request(test)
				.then(console.log.bind(console))
				.catch(function(err){
					console.log('request caught and error');
					console.log(err);
				});
			};

			//class methods
			
			Class.fetch = function () {
				//returns a promise or an object ?
				var _str = '{"attribute1":"value"}';
				var _obj = JSON.parse(_str);
				return Class.create(_obj);
			};

			//instance methods
			Class.prototype.sync = function (id) {

			};
			Class.prototype.fetch = function () {
				//returns a promise or an object ?
				var _str = '{"attribute1":"value"}';
				var _obj = JSON.parse(_str);
				this.update(obj);
			};
			Class.prototype.save = function () {

			};

		function request (url) {
			return new Promise(function(resolve, reject) {
				var _xhr = new XMLHttpRequest();
				if (model.auth)
					_xhr.setRequestHeader('x-token', model.auth());
				var _url = model.map ? model.map[model.prefix] : url;
				_xhr.responseType = 'json';
				_xhr.open('GET', _url);
				_xhr.onload = function (e) {
					if (_xhr.status == 200)
						resolve(_xhr.response);
					else
						reject(e);
				};
				_xhr.onabort = function(e) {
					console.log('on abort called');
					reject(e);	
				};
				_xhr.onerror = function(e) {
					console.log('on error called');
					reject(e);	
				};
				// _xhr.onload = function(e) {
				// 	reject(e);	
				// };
				// _xhr.onloadend = function(e) {
				// 	reject(e);	
				// };
				// _xhr.onloadstart = function(e) {
				// 	reject(e);	
				// };
				// _xhr.onprogress = function(e) {
				// 	reject(e);	
				// };
				// _xhr.onreadystatechange = function(e) {
				// 	reject(e);	
				// };
				// _xhr.ontimeout = function(e) {
				// 	reject(e);	
				// };
				_xhr.send();
			});
		}
			
			return Class;
		}
	}

}(this);