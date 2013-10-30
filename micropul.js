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


var corners = {
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
		var adjacent = {} , nsCol , eCol , wCol , x , y;
		if ( this.board  && this.position )
		{
			x = this.position.x;
			y = this.position.y;

			nsCol = this.board[ x ];
			eCol = this.board[ x + 1 ];
			wCol = this.board[ x - 1 ];

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

	Board.prototype.validateMove = function( tile , x , y ) {
		return this.checkColorRule( tile , x , y ) &&
			this.checkAttachmentRule( tile , x , y );
	};

	Board.prototype.updateBounds = function( x , y ){
		this.bounds.x.min = Math.min( this.bounds.x.min , x );
		this.bounds.x.max = Math.max( this.bounds.x.max , x + 1 );

		this.bounds.y.min = Math.min( this.bounds.y.min , y );
		this.bounds.y.max = Math.max( this.bounds.y.max , y + 1 );
	};

	Board.prototype.checkColorRule = function( tile , x , y ){
		var ne = {} , se = {} , sw = {} , nw = {},
			adjacent = tile.adjacent;

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

		[ ne , se , sw , nw ].forEach( function( corner ) {

		}.bind( this ) );

	};




	return Board;

} () );
