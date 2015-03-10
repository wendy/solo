var width = 795;
var height = 600;
var playerSize = 15;
var madePlayer = false;

var board = d3.select('#game')
  .append('svg')
  .attr( 'class', 'board')
  .attr( 'width', width)
  .attr( 'height', height)

var randomNumber = function(max){ return Math.floor(Math.random() * max) }


var addPlayers = function(name, pX, pY, color){
  board.selectAll('#players')
  .data([name]).enter().append('rect')
  .attr('class', 'players')
  .attr( 'id', function(d,i){return name } )
    .attr({
      'x': pX,
      'y': pY,
      'width': playerSize,
      'height': playerSize,
      'fill': color,
      'opacity': .9
    })
};

var color = d3.scale.category10()
    .domain(d3.range(40));

var name; 
var colorr = color(Math.floor(Math.random() * 40));
var x = 0;
var y = 0;


$(function(){

  var myDataRef = new Firebase('https://firedodgeball.firebaseio.com/');
  var myDataRefBalls = new Firebase('https://fireballs.firebaseio.com/');

 // PLAYERS DATA
  myDataRef.on('child_added', function(snapshot) {
    console.log(snapshot.val())
    var player = snapshot.val();
    addPlayers(player.name, player.x, player.y, player.c);
  });

  myDataRef.child('balls').push({})

  myDataRef.on('child_changed', function(snapshot) {
    var player = snapshot.val();
    movePlayer(player.name, player.x, player.y);
  });

  myDataRef.on('child_removed', function(oldChildSnapshot) {
    var player = oldChildSnapshot.val();
    deletePlayer(player.name);
  });


  var movePlayer = function(playerID, pX, pY){
    d3.select('#' + playerID).transition().duration(100).attr('y', pY).attr('x', pX);
  }

  var deletePlayer = function(playerID){
    d3.select('#' + playerID).remove();
  }

// ADD PLAYER: DB NAME AND ADD OBJECT 
  $('.button').on('click', function(e){
    e.preventDefault();
    if( madePlayer === false ){
      name = $('#name').val();
      myDataRef.child(name).set({name: name, x: x, y: y, c: colorr })
      madePlayer = true;  
    }
  })

//ARROW KEYS FUNCTIONS
  d3.select("body")
    .on("keydown", function() {
      var key = d3.event.keyCode
      if( key === 37 ){
        x-= playerSize;
        if(x < 0){
          x+= playerSize;
        } else {
          myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
        }
      }
      if( key === 39 ){
        x+= playerSize;
        if(x > width - playerSize){
          x-= playerSize;
        } else {
          myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
        }
      }
      if( key === 38 ){
        y-= playerSize;
        if(y < 0){
          y+= playerSize;
        } else {
          myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
        }
      }
      if( key === 40 ){
        y+= playerSize;
        if(y > height - playerSize){
          y-= playerSize;
        } else {
          myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
        }
      }      

    });

  //BALLS
    'use strict';
      window.balls = [];

      var randomNumber = function(){ return Math.floor(Math.random() * 40) * 15}
      var data = function(){
        return [{
          dx: 1,
          dy: 1,
          cx: randomNumber(),
          cy: randomNumber()
        }]
      };
      console.log(data);
      var createElm = function(d) {
        var self = this;
        var elm = d3.select(this);
        var newElm = board.append('circle').data(d).attr({
          cx: function(d){ return d.cx },
          cy: function(d){ return d.cy},
          r: 10,
          fill: "red",
          stroke: "white",
          "stroke-opacity": 0.7,
        }).classed("d3-balls", true);    

        balls.push(newElm);
        console.log(balls);
      }


      function ticker () {
          d3.selectAll(balls)
            .each(transition);
        
        window.setTimeout(ticker, 5);
      }
      
      function transition() {
        var ball = this;
        var dx = ball.data()[0].dx;
        var dy = ball.data()[0].dy;
        var x = parseInt(ball.attr("cx")) + dx;
        var y = parseInt(ball.attr("cy")) + dy;
        var r = parseInt(ball.attr("r"));


        if (x <= r || x + r >= width) {
          dx = -dx;
        } 

        if (y <= r || y + r >= height) {
          dy = -dy;
        }

        x += dx;
        y += dy;
     
        ball.data([{dx: dx, dy: dy}]);
        ball.attr("cx", x);
        ball.attr("cy", y);
        
      }

      function init () {
        createElm(data());
        ticker();
      }

      // $('.addBalls').on('click', function(e){
      //   e.preventDefault();
      //   createElm(data());
      // }
      document.addEventListener('DOMContentLoaded', init);

// ON CLOSE - REMOVE
  var removeDBChild = function(){
    myDataRef.child(name).remove();
  }
  window.onbeforeunload = function(){
    removeDBChild();
  }

}())

