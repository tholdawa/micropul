/*global requirejs*/

requirejs( ['Game' , 'utils'] , function( Game , utils ){

	console.log( "Loaded game dependencies." ) ;

	var game = Game();

	console.log( game.board.toString() );

});
