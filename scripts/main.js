/*global requirejs*/

requirejs( ['Game' , 'utils'] , function( Game , utils ){

	console.log( "Loaded game dependencies." ) ;

	var game = Game( 1 );

	window.game = game;

	console.log( game.board.toString() );

});
