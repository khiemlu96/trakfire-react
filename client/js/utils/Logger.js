var Logger = {
	namespace: null,
	init: function(namespace){ this.namespace = namespace; },
	log: function(msg){
		console.log(this.namespace , msg);
	}
}

module.exports = Logger;