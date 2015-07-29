# Raft localStorage Methods
```javascript

```

**WARNING**
These methods are not production ready, most behaviour in error-prone situation are either undefined or clearly app-breaking.
Very few features are present right now, this decorator is still a WIP, that we will consolidate on our company use case.

sync : this function sends a request and updates the object with the response.

'sync' is either given an option object or is using the default request definition in the model
```javascript
myModel.request = {
	url: 'http://my.api.endpoint/myModel',
	method: 'POST',
	headers: {
		x-token: ''
	},
	send: ['id', 'version'],
	tree: {
		foo: true,
		bar: {
		 	foobar:true
		}
	}
};
```

**Warning !**
This request typology is under construction and will most likely change dramatically.

**Warning !**
Our model aims at reducing cascading requests of the type:
collection -> request -> collection -> request ...  

Especially when apps load, it can be interesting to receive a bigger (somehow) request than suffering from addition of delays...

We are developing a [sails](http://sailsjs.org/) plugin that allows nested recursive 'populate' requests.

if 'update' is given an option object too, it should be passed as the second parameter, yet to be implemented...

sync returns a promise, resolved after the request succeeded and internal call of update.

Instance methods :

- [sync](#sync)

Collections instance expose :

- [sync](#sync)

##Default instance methods

###sync
```javascript
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
```
##Default collection methods

###sync

```javascript
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
```


##Lib
how should we handle timeout, errors, etc ?  
a 'pending' storage for failed user-based submissions might be interesting
```javascript
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
```