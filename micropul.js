'use strict';

Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len[
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();


var corner = {
	blank : {} ,
	black : { micropul : 'black' },
	white : { micropul : 'white' },
	one : { catalyst : 1 },
	two : { catalyst : 2 },
	plus : { extraTurn : 2 }
};

var Tile = ( function () {
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

} () );

var Board = ( function() {
	function Board() {
		if ( ! ( this instanceof Board ) ) {
			return new Board();
		}
		this.bounds = {};
		this.bounds.x = {};
		this.bounds.y = {};
		this.bounds.x.min = this.bounds.x.max = this.bounds.y.min = this.bounds.y.max = 0;

		return this;
	};

	Board.prototype.adjacent = function( x , y ){
		var nsCol, eCol, wCol, adjacent = {};

		nsCol = this[ x ];
		eCol = this[ x + 1 ];
		wCol = this[ x - 1 ];

		if ( nsCol ) {
			if ( nsCol[ y - 1 ] ) {
				adjacent.n = nsCol[ y - 1 ];
			}
			if ( nsCol[ y + 1 ] ) {
				adjacent.s = nsCol[ y + 1 ];
			}
		}
		if ( eCol ) {
			adjacent.e = eCol[ y ];
		}
		if ( wCol ) {
			adjacent.w = wCol[ y ];
		}
		return adjacent;
	};


	Board.prototype.insert = function( tile , x , y ) {
		this[ x ]  = this [ x ] || {};
		this[ x ][ y ] = tile;
		tile.board = this;
		tile.position = { x: x , y: y };

		this.updateBounds( x , y );
	};

	Board.prototype.at = function( x , y ) {
		return this[ x ]  && this[ x ][ y ];
	};

	Board.prototype.updateBounds = function( x , y ){
		this.bounds.x.min = Math.min( this.bounds.x.min , x );
		this.bounds.x.max = Math.max( this.bounds.x.max , x + 1 );

		this.bounds.y.min = Math.min( this.bounds.y.min , y );
		this.bounds.y.max = Math.max( this.bounds.y.max , y + 1 );
	};

	Board.prototype.validateMove = function( tile , x , y ){
		var ne = {} , se = {} , sw = {} , nw = {},
			adjacent = this.adjacent( x , y );

		ne.corner = tile.corners.ne;
		se.corner = tile.corners.se;
		sw.corner = tile.corners.sw;
		nw.corner = tile.corners.nw;

		ne.adjacent = { n: adjacent.n && adjacent.n.corners.se ,
						e: adjacent.e && adjacent.e.corners.nw };
		se.adjacent = { s: adjacent.s && adjacent.s.corners.ne ,
						e: adjacent.e && adjacent.e.corners.sw };
		sw.adjacent = { s: adjacent.s && adjacent.s.corners.nw ,
						w: adjacent.w && adjacent.w.corners.se };
		nw.adjacent = { n: adjacent.n && adjacent.n.corners.sw ,
						w: adjacent.w && adjacent.w.corners.ne };

		function checkColorRule() {
			return [ ne , se , sw , nw ].every( function( corner ) {
				var dir;
				if ( corner.corner.micropul ) {
					for ( dir in corner.adjacent ) {
						if ( corner.adjacent[ dir ] &&
							 corner.adjacent[ dir ].micropul &&
							 corner.adjacent[ dir ].micropul !== corner.corner.micropul ) {
								 return false;
							 }
					}
				}
				return true;
			});
		}

		function checkAttachmentRule() {
			return [ ne , se , sw , nw ].some( function( corner ) {
				var dir;
				if ( corner.corner.micropul ) {
					for ( dir in corner.adjacent ) {
						if ( corner.adjacent[ dir ] && corner.adjacent[ dir ].micropul ) {
							return true;
						}
					}
				}
				return false;
			} );
		}

		return checkColorRule() && checkAttachmentRule();


	};

	Board.prototype.toString = function() {
		function cornerToString( corner ) {

			if ( corner.micropul )
				return corner.micropul[0];

			if ( corner.catalyst ) {

				if ( corner.catalyst === 1 )
					return ".";

				return ":";
			}

			if ( corner.extraTurn )
				return "+";

			return "_";
		}

		var i , j , result = "" , row , tile, lower;

		for ( i = this.bounds.x.min ; i < this.bounds.x.max ; ++i ) {
			row = this[ i ];

			for ( lower = 0 ; lower < 2 ; ++lower ) {

				for ( j = this.bounds.y.min ; j < this.bounds.y.max ; ++j ) {
					tile = row[ j ];

					if ( tile ) {

						if (!lower ) {
							result += cornerToString( tile.corners.nw ) +
								cornerToString( tile.corners.ne);
						}
						else {
							result += cornerToString( tile.corners.sw ) +
								cornerToString( tile.corners.se);
						}

					}
					else {
						result += "  ";
					}
				}
				result += "\n";
			}
		}

		return result;

	};





	return Board;

} () );
