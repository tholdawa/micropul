/*global requirejs*/

requirejs( ['Game' , 'utils'] , function( Game , utils ){

	function testShuffle( n ) {
		var i, arr, results = {}, key;
		for ( i = 0 ; i < n ; ++i ) {
			arr = [ 1,2,3,4 ];
			shuffle( arr );
			key = arr.toString();
			( results[ key ] && ( results[ key ] += 1 ) ) || ( results[ key ] = 1 );
		}
		return results;
	}

	var game = new Game();

	console.log( "Loaded game dependencies." ) ;
	console.log( game.board.toString() );

});
