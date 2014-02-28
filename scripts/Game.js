/*global define*/

define( [ 'Board' , 'Player' , 'utils' , 'Deck' ] , function( Board , Player , utils , Deck ){
	function Game( numPlayers ) {

		var game = { core: Deck() ,
					 board: Board(),
					 players: [],

					 draw: function( n ){
						 return ( n === 0 || !this.core.length ) ? [] :
							 [ this.core.pop() ].concat( this.draw( n - 1 ) );
					 } ,
					 isGameOver: function () {
						 // game is over when core is exhausted or any player has no moves.
						 return !this.core.length ||
							 this.players.some( function( player ) {
								 return !( player.hand.length || player.supply.length || player.stones );
							 } );
					 }
				   } ,
			i,
			MAX_HAND_SIZE = 6;

		numPlayers = numPlayers || 1;

		// Initialize Game state

		// insert players
		for ( i = 0 ; i < numPlayers ; ++i ) {
			game.players.push( Player( game ) );
		}

		// place starting tile on board, then shuffle remaining tiles.
		game.board.insert( game.core.pop() , 0 , 0 );
		utils.shuffle( game.core );

		// draw player initial hands
		game.players.forEach( function( player ) {
			player.drawToHand( MAX_HAND_SIZE );
		});

		return game;
	}

	return Game;
});
