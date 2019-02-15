

var updatePlayerPositionBuffer = function(localStorageJSON, isforward) {
	var obj= JSON.parse(  localStorageJSON );
	if(isforward===true){
		++obj.jerry
	}

	if(isforward===false){

		if( obj.jerry >1 ) {
			--obj.jerry
		}
	}
 	return  JSON.stringify(obj);

  };



  var getPlayerXY = function( obj ) {
  	var jerryX;
  	var jerryY;
  	if(obj!=undefined  && obj.constructor===Object){
  		jerryY=obj.jerry %10;
  		jerryX= Math.ceil(obj.jerry /10)  %10
  	}else {
  		jerryY=obj %10;
  		jerryX= Math.ceil(obj /10)  %10
  	}

  	if(jerryX==0){
  		jerryX=10;
  	}
  	if(jerryY==0){
  		jerryY=10;
  	}

  	return[jerryX,jerryY]
  };


  var movePlayer= function(jqueryElement, arrayXYPosition){
  	var x=arrayXYPosition[0];
  	var y= arrayXYPosition[1];
  	var bool=false;
  	jqueryElement.children(".jerry").css ( "grid-row-start",`${ y===0 && 10 || y}`);
  	jqueryElement.children(".jerry").css ( "grid-column-start",`${ x===0 && 10 || x}`);
  	

  	if(x!=1 || y!=1){ 
  		setLocalValue("userStarted",true); 
  	}


  };



 var randomRGBHex= function (data) {
	var table= '0123456789ABCDEF'
	data='#';
	for( var i =0 ; i<6 ; i++) {
		data+= table[ Math.floor( Math.random( )*table.length )  ]
	}	
	return data ;
};


var functionList= [
	new Function("a", "return a - 10	;"),  //top
	new Function("a", "return a - 10-1	;"),  //top-left
	new Function("a", "return a - 10+1	;"),  //top-right
	new Function("a", "return a + -1	;"),  // left
	new Function("a", "return a + 1		;"),  // right 				4
	new Function("a", "return a + 10	;"),  //bottom 				5
	new Function("a", "return a + 10-1	;"),  //bottom-left			
	new Function("a", "return a + 10+1	;"),  //bottom-right 		7
];

var obj= {

	1	: [4,5,7]  ,     // top-left
	10	: [3,5,6]  , 	 //	top-right
	91	: [0,2,4]  ,     // bottom-left
	100	: [3,0,1]  ,	 //	bottom-right
   "all": [0,1,2,3,4,5,6,7] ,

	borderIndices : function(pos){ 
		if( pos>1 && pos<10){ return [3,4,5,6,7] }	;  //top
		if( pos.toString()[1] === '1') {return [ 0,5,4,7,2 ] }	; //left
		if( pos.toString()[1] === '0') {return [ 3,0,5,6,1]  }	; //right
		if( pos.toString()[0] === '9') {return [ 3,4,0,1,2]	 }	; //bottom
	},

};

var playerMoveLocationMap = function(pos) {
	var result=  obj[pos]!=undefined

	if( result) {
		result= obj[pos].slice()
		return result
	}

	result=obj.borderIndices(pos);
	return result!=undefined&&result || obj.all.slice();
};


var possibleMoves = function(obj,gridPosition){
	if(obj.length ===0){
		return []; 
	}

	if(obj.constructor===Array) {
		return [ obj[0](gridPosition) ].concat(possibleMoves( obj.slice(1),gridPosition) );  
	}
	
	return possibleMoves( functionList.slice() ,gridPosition)
};



var arrayOfMoveLocation = function( gridPosition ){

	if( [1,10,90,100].includes(gridPosition) ) {
	 	return possibleMoves(3,gridPosition); 
	}
	
	if( ['0','9','1'].includes( gridPosition.toString()[0] ) || gridPosition%10===0 ) {
		return possibleMoves(5,gridPosition); 
	}

	return possibleMoves(8,gridPosition); 

};


var listHasNegativeNumber = function(list ) {
	return list.find(function(x){
		return x<0;
	});
} ;


var listHasNumberGreaterThan = function(list,number ) {
	return list.find(function(x){
		return x>100;
	});
} ;

var listElementsOfKey =  function(list,indices) {
	
	if(indices.length==0){
		return []; 
	}

	return  [ list[indices.shift()]].concat( listElementsOfKey(list,indices )); 
};


var getLocalValue= function(key){
	return JSON.parse(localStorage.getItem(key))
}

var setLocalValue= function(key,data){
	localStorage.setItem( key, JSON.stringify(data)); 

}



var renderPosLights = function(xyPosition,jqueryElement,arrBuffer) {

	var moves = arrayOfMoveLocation(xyPosition);
	var indices = playerMoveLocationMap(xyPosition);
	var positionList= listElementsOfKey(  moves, indices );
	var $element;
	
	jqueryElement.children().filter('.helper-block').remove();
	

	positionList.forEach( function(pos){

		var xy= getPlayerXY(pos); 
		var y= xy[0];
		var x= xy[1];


		var arr= getLocalValue("greenZone");
		arr.push( xy.toString() );
		setLocalValue("greenZone",arr);

		$element= $(`<div class="helper-block"></div>`);
		$element.css("grid-row-start", `${y}`);
		$element.css("grid-column-start",`${x}`);
		jqueryElement.append( $element)
			  	
	}); 


}


var questionMarkLightShow= function(className,tag) {
  window.setInterval ( function(){
    $(className).css(tag||"color", randomRGBHex(),1000);
  });
  
  return;
}

var rand = function(n, enableInit,yData){
	var init=1 ;
	if(enableInit && yData<3){
		init=3;
	}
	return Math.floor(Math.random() * (10 - init + 1)) + init; 	
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values_inclusiv

};

var destinyList= ["Death", "Random Jump", "Gameover","Fire"] 
var createQuestionElement = function(jqueryParentElement, n) {
	var className="circle-block";
	var key= "jerrysFate";
	var $element= $(`<div class="${className}">?</div>`);
	var storage = 	localStorage.getItem(key);
	var y=rand(n,false);

	var x=rand(n,true,y);
	var data= JSON.parse( localStorage.getItem(key) );
	$element.css("grid-row-start",`${y}`)
	$element.css("grid-column-start",`${x}`);
	jqueryParentElement.append($element);

	data[ JSON.stringify([x,y]) ] =  destinyList[ Math.floor(Math.random() * (getLocalValue("questionCount")))] || "Nothing Here"
	localStorage.setItem( key, JSON.stringify(data)); 

};

var renderQuestionMarks= function (jqueryParentElement,count) {
	
	if(count===undefined){
		localStorage.setItem("jerrysFate",JSON.stringify({testing:123}) );
		return renderQuestionMarks(jqueryParentElement,getLocalValue("questionCount"));
	}

	 if(count.constructor===Number) {
	 	count--;

		createQuestionElement(jqueryParentElement,count);	
		if(count!=0){
			return renderQuestionMarks(jqueryParentElement,count);
		}
	} 
	return  questionMarkLightShow(".circle-block");
};


var resetBoard = function() {
	setLocalValue("questionCount",10);

   movePlayer( $(".grid-background"),[1,1] );
	
	$(".circle-block").remove();

  localStorage.clear();
  localStorage.setItem("player",  JSON.stringify(  [1,1] ) )
  localStorage.setItem("startX",$(".grid-background")[0].offsetLeft );
  localStorage.setItem("startY",$(".grid-background")[0].offsetTop );
  localStorage.setItem("helperOn", false)
  localStorage.setItem("userStarted",false)
  localStorage.setItem("questionCount",10)
  localStorage.setItem("priorEqNew", true );
  localStorage.setItem("priorData",JSON.stringify ([1,1]) );
  localStorage.setItem("xyData",JSON.stringify ([1,1]) );
  setLocalValue("greenZone",[])
  renderQuestionMarks ( $(".grid-background") ) ; 
  renderPosLights( 1, $(".grid-background"),getLocalValue("greenZone") );

  $(".helper-block").hide();

};

 


var xyCoordinateToNumber = function(xyArray){
	return (xyArray[0]-1 )*10. + xyArray[1] ;
}















