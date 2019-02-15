

$(document).ready(function(){

  resetBoard();

  $(".helper-block").hide();

  // click highlighted region to move
  $(".grid-background").click(function(event){
    var x= Math.ceil((event.originalEvent.x - localStorage.getItem("startX")) /40) ;
    var y= Math.ceil((event.originalEvent.y - localStorage.getItem("startY")) /40) ;
    setLocalValue("xyData",[y,x])
    var data=[y,x];
    var key= "jerrysFate";
    var outcome;
    var getObj;



    if( getLocalValue("greenZone").includes((getLocalValue("xyData")).toString()) ) {
      localStorage.setItem("player", JSON.stringify( getLocalValue("xyData") ) );    

      movePlayer( $(".grid-background"),[x,y] );

      setLocalValue("greenZone",[]);

      renderPosLights( xyCoordinateToNumber( getLocalValue("xyData") ), $(".grid-background"),getLocalValue("greenZone") );
    
      getObj= getLocalValue(key)
      questionOutcome= getObj[JSON.stringify([x,y])] ;


      if(questionOutcome ){
        $(".messenger-box").text( questionOutcome)
        window.setTimeout( function(){
        $(".circle-block").filter(function(idx,element){
          return $(element).css("grid-column-start")==x && $(element).css("grid-row-start")==y ;
        }).remove()
      $(".messenger-box").text("") },1000)
    }


    if(x==10 && y==10){
      $(".messenger-box").text("WINNER") ;
      questionMarkLightShow(".messenger-box");
      window.setTimeout( function(){
        $(".messenger-box").text("") 
        $(".messenger-box").text("") 

        resetBoard()
      },1000);
    }

     setLocalValue("priorData", getLocalValue("xyData"));
     
     if(getLocalValue("priorEqNew")) {
      setLocalValue("priorEqNew",false);
     }
     setLocalValue("priorEqNew", getLocalValue("priorData").toString()=== getLocalValue("xyData").toString()  )
    } else{
      $(".messenger-box").text("YOU NEED HELP, CLICK QUESTION MARK ABOVE") ;
      window.setTimeout( function(){
        $(".messenger-box").text("") },500);
    }

    if( !JSON.parse(localStorage.getItem("helperOn"))  ) {
      $(".helper-block").hide();
    }
  });

  $(".difficulty-button").click(function(event){

    if( getLocalValue("userStarted")==false ){

      $(".circle-block").remove();

      
      if(event.currentTarget.classList[1] =="easy"){
        setLocalValue("questionCount",10);
      }
      
      if(event.currentTarget.classList[1] =="medium"){
        setLocalValue("questionCount",25);
      } 

      if(event.currentTarget.classList[1] =="hard"){
        setLocalValue("questionCount",48);

      }  

      renderQuestionMarks ( $(".grid-background") ) ; 

    }else {

      $(".messenger-box").css("animation-duraction","5s")

      $(".messenger-box").html(`</span>Either Finish or click reset..Sorry &#x1F643 </span>`) ;
      window.setTimeout( function(){
        $(".messenger-box").html("") },500);
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