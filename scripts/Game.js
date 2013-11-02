/*global define*/

define( [ 'Board' , 'Player' , 'utils' , 'deck' ] , function( Board , Player , utils , deck ){
	function Game() {
		if ( !( this instanceof Game ) ) {
			return new Game();
		}
		this.core = deck();
		this.board = Board();
		this.board.insert( this.core.pop() , 0 , 0 );
		utils.shuffle( this.core );
	};

	Game.prototype.draw = function( n ){
		return ( n === 0 || !this.core.length ) ? [] :
			[ this.core.pop() ].concat( this.draw( n - 1 ) );
	};



	return Game;
});
