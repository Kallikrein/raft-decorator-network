!function(env) {
	'use strict';
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = raftNetwork;
	else if (typeof define === "function" && define.amd) define(raftNetwork);
	else env.raftNetwork = raftNetwork();

	function raftNetwork(){
		/*  LIB  */
		// how should we handle timeout, errors, etc ?
		// a 'pending' storage for failed user-based submissions might be interesting
		function myrequest(options) {
			return new Promise(function (resolve, reject) {
				var _xhr = new XMLHttpRequest();
				_xhr.responseType = 'json';
				options.method = options.method || 'GET';
				_xhr.open(options.method, options.url);
				_xhr.onload = function (e) {
					resolve(_xhr.response);
				};
				for (header in options.headers)
					_xhr.setRequestHeader(header, options.headers[header]);
				_xhr.send(options.body);
			});
		}
		/*! LIB !*/
		return {
			collection: function (inherits, constructor) {
				/*  COLLECTION INHERITAGE  */
				function Collection(constructor, value) {
					inherits.call(this, constructor, value);
				}
				for (var element in inherits.prototype) {
					if ({}.toString.call(inherits.prototype[element]).slice(8, -1) == 'Function' )
						Collection.prototype[element] = inherits.prototype[element];
				}
				for (var element in inherits) {
					if ({}.toString.call(inherits[element]).slice(8, -1) == 'Function' )
						Collection[element] = inherits[element];
				}
				/*! COLLECTION INHERITAGE !*/
				/*  COLLECTION METHODS  */
				// sync is either given an option object or is using the default request definition in the model
				// if 'update' is given an option object too, it should be passed as the second parameter
				Collection.prototype.sync = function (options) {
					var self = this;
					options = options || this._constructor.model.request;
					options.body = options.body || JSON.stringify({
						request: self.pluck(options.send),
						tree: options.tree
					});
					var req = myrequest(options)
					.then(function (response) {
						self.update(response);
						return(self);
					});
					return req;
				};
				/*! COLLECTION METHODS !*/
				return Collection;
			},
			class: function (inherits, model) {
				/*  CLASS INHERITAGE  */
				function Class(value) {
					inherits.call(this, value);
				}
				for (var element in inherits.prototype) {
					if ({}.toString.call(inherits.prototype[element]).slice(8, -1) == 'Function' )
						Class.prototype[element] = inherits.prototype[element];
				}
				for (var element in inherits) {
					if ({}.toString.call(inherits[element]).slice(8, -1) == 'Function' )
						Class[element] = inherits[element];
				}
				/*! CLASS INHERITAGE !*/
				/*  CLASS METHODS  */
				Class.prototype.sync = function (options) {
					var self = this;
					options = options || model.request;
					options.body = options.body || JSON.stringify({
						request: [self.pluck(options.send)],
						tree: options.tree
					});
					var req = myrequest(options)
					.then(function (response) {
						self.update(response[0]);
						return(self);
					});
					return req;
				};
				/*! CLASS METHODS !*/
				return Class;
			}
		};
	}
}(this);