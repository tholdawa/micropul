/*global define*/

define( ['Tile'] , function( Tile ) {
	function BigTile( color , catalyst , board ) {
		return {
			board: board,
			bigTile: { color: color , catalyst: catalyst },
			rotate: function(){},
			adjacent: Tile.adjacent,
			toString: function() {
				return "Big Tile" + this.bigTile + " at " + this.position.x + "," + this.position.y;
			}
		};
	}

	return BigTile;
});
