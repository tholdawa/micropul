/*global define*/

define( ['Tile'] , function( Tile ) {
	function BigTile( color , catalyst , board ) {
		return {
			board: board,
			bigTile: { color: color , catalyst: catalyst },
			rotate: function(){},
			adjacent: Tile.adjacent,
			toString: function() {
				return "Big Tile" + this.bigTile + " at " + ( this.position && this.position.x ) + "," + ( this.position && this.position.y );
			},
			corners : { ne: color , se: color , sw: color , nw : color }
		};
	}

	return BigTile;
});
