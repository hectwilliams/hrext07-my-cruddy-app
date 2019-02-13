

var updatePlayerPosition = function(jqueryNode, obj, isforward) {
	var data= JSON.parse(  obj );
	var select=["tom","jerry" ][ +jqueryNode.hasClass("jerry") ]

	if(!isforward &&  Object.values(data).every(function (x){ return x==0}) ) {
		return obj; 
	}

	if(isforward===true){
		++data[select]
	}

	if(isforward===false){

		if( data[select] >0 ) {
			--data[select]
		}
	}


 	return  JSON.stringify(data);

  }