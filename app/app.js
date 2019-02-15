

$(document).ready(function(){




  resetBoard();

  $(".helper-block").hide();



  // click highlighted region to move
  $(".grid-background").click(function(event){
    var x= Math.ceil((event.originalEvent.x - localStorage.getItem("startX")) /40) ;
    var y= Math.ceil((event.originalEvent.y - localStorage.getItem("startY")) /40) ;
    var data=[y,x];
    var key= "jerrysFate";
    var outcome;
    var getObj;

    if( getLocalValue("greenZone").includes(data.toString()) ) {
      localStorage.setItem("player", JSON.stringify(data) );    
      movePlayer( $(".grid-background"),[x,y] );

      setLocalValue("greenZone",[]);

      renderPosLights( xyCoordinateToNumber(data), $(".grid-background"),getLocalValue("greenZone") );
    
      getObj= getLocalValue(key)
      questionOutcome= getObj[JSON.stringify([x,y])] ;


      if(questionOutcome ){
        $(".messenger-box").text( questionOutcome)
          window.setTimeout( function(){
          
          $(".circle-block").filter(function(idx,element){
           return $(element).css("grid-column-start")==x && $(element).css("grid-row-start")==y ;
          }).remove()
          $(".messenger-box").text("") },1000);

    }


    if(x==10 && y==10){
      $(".messenger-box").text("WINNER") ;
      
      window.setTimeout( function(){
        $(".messenger-box").text("") 
        resetBoard()
      },1000);
      }
    }else{

      $(".messenger-box").text("NOT ALLOWED") ;
      window.setTimeout( function(){
        $(".messenger-box").text("") },500);
    }

    

    if( !JSON.parse(localStorage.getItem("helperOn"))  ) {
      $(".helper-block").hide();
    }

  


  });

  $(".test").click(function(){
             localStorage.setItem("helperOn",  !JSON.parse( localStorage.getItem("helperOn") )  ) ;

    if( JSON.parse( localStorage.getItem("helperOn") )===true ){

      $(".helper-block").show();
        $(".test").html("Remove Assitance")
    }else {
      $(".helper-block").hide();
      $(".test").html("?")

    }

  });

$(".reset").click(function(){
  resetBoard();

})











});