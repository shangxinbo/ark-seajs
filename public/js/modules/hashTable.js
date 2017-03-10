define(function(require, exports, module){
	var table = new Array(3253);
	
	exports.buildChains = function(){
		for (var i = table.length - 1; i >= 0; i--) {
			table[i] = new Array();
		}
	}
	exports.showDistro = function(){
		var n=0;
		for (var i = table.length - 1; i >= 0; i--) {
			if (table[i][0] !== undefined) {
				console.log(i + ": " + table[i]);
			}
		}		
	}
	exports.hash = function(val){
		const H = 37;
		var total = 0;
		for (var i = val.length - 1; i >= 0; i--) {
			total = total*H + val.charCodeAt(i);
		}
		return total % table.length;		
	}
	exports.put = function(data){
		var pos = exports.hash(data);
		var index = 0;
		if (table[pos][index] == undefined) {
			table[pos][index] = data;
		}else {
			while (table[pos][index] != undefined) {
				index++;
			}
			table[pos][index] = data;
			table[pos].length = index+1;
		}		
	}
	exports.get = function(data){
		var index = 0;
		var pos = exports.hash(data);
		if(table[pos][index] == undefined){
			return undefined;
		}else if (table[pos][index] == data) {
			return table[pos][index];
		}else{
			for (var i=0;i<table[pos].length;i++) {
				if(table[pos][i] == data){
					return table[pos][i];
				}
			}	
		}
	}
	exports.del = function(data){
		var index = 0;
		var pos = this.hash(data);
		if(this.table[pos][index] == undefined){
			return undefined;
		}else if (this.table[pos][index] == data) {
			this.table[pos].splice(index,1);
			return this.table[pos][index];
		}else{
			for (var i=0;i<this.table[pos].length;i++) {
				if(this.table[pos][i] == data){
					this.table[pos].splice(i,1);
					return this.table[pos][i];
				}
			}	
		}
	}
	exports.showDistro = function(){
		var n=0;
		for (var i = table.length - 1; i >= 0; i--) {
			if (table[i][0] !== undefined) {
				console.log(i + ": " + table[i]);
			}
		}
	}
});