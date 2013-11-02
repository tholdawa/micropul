/*global define*/

define( function() {

	function Tile( corners , board ) {
		if ( ! (this instanceof Tile) ) {
			return new Tile( corners , board );
		}
		this.board = board;
		this.corners = { ne : corners.ne , se : corners.se , sw : corners.sw , nw : corners.nw };
		return this;
	}

	Tile.prototype.rotate = function() {
		var tmp = this.corners.ne;
		this.corners.ne = this.corners.se;
		this.corners.se = this.corners.sw;
		this.corners.sw = this.corners.nw;
		this.corners.nw = tmp;
	};

	Tile.prototype.adjacent = function() {
		var adjacent = {} ;
		if ( this.board  && this.position )
		{
			adjacent = this.board.adjacent( this.position.x , this.position.y );
		}

		return adjacent;
	};

	Tile.prototype.toString = function() {
		return "Tile " + this.corners + " at " + this.position.x + "," + this.position.y;
	};

	return Tile;

});
