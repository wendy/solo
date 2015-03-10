var width = 800;
var height = 300;

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
      'width': 20,
      'height': 20,
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

  myDataRef.on('child_added', function(snapshot) {
    var player = snapshot.val();
    addPlayers(player.name, player.x, player.y, player.c);
  });

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
    name = $('#name').val();
    myDataRef.child(name).set({name: name, x: x, y: y, c: colorr })
  })

  d3.select("body")
    .on("keydown", function() {
      var key = d3.event.keyCode
      if( key === 37 ){
        x-= 10;
        myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
      }
      if( key === 39 ){
        x+= 10;
        myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
      }
      if( key === 38 ){
        y-= 10;
        myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
      }
      if( key === 40 ){
        y+= 10;
        myDataRef.child(name).set({name: name, x: x, y: y, c: colorr});
      }      

    });

  window.onbeforeunload = function() {
    myDataRef.child(name).remove();
  }
}())

