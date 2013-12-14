/*global define*/

define( [ 'Board' , 'Player' , 'utils' , 'deck' ] , function( Board , Player , utils , deck ){
	function Game() {

		var game = {
			core: deck() ,
			board: Board(),

			draw: function( n ){
				return ( n === 0 || !this.core.length ) ? [] :
					[ this.core.pop() ].concat( this.draw( n - 1 ) );
			}
		};

		game.board.insert( game.core.pop() , 0 , 0 );
		utils.shuffle( game.core );

		return game;
	}

	return Game;
});
