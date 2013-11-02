'use strict';

function shuffle( arr ){
	var len = arr.length,
		i , j , tmp;
	for ( i = len - 1; i > 0 ; --i ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

function chunks( array , size ) {
	var result = [], slice = [].slice, start = 0 , end = array.length;
	while ( start < end ) {
		result.push( slice.call( array , start , start + size ) );
		start += size;
	}
	return result;
}


var corner = {
	blank : {} ,
	black : { micropul : 'black' },
	white : { micropul : 'white' },
	one : { catalyst : true , draws : 1 },
	two : { catalyst : true , draws : 2 },
	plus : { catalyst : true , extraTurn : true }
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

				if ( corner.draws ) {
					if ( corner.draws === 1 )
						return ".";

					return ":";
				}
				if ( corner.extraTurn )
					return "+";
			}
			return "_";
		}

		var i , j , result = "" , row , tile, lower;

		for ( j = this.bounds.y.min ; j < this.bounds.y.max ; ++j ) {

			for ( lower = 0 ; lower < 2 ; ++lower ) {

				for ( i = this.bounds.x.min ; i < this.bounds.x.max ; ++i ) {
					tile = this[ i ][ j ];

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

	Board.prototype.activateCatalysts = function( tile , x , y ){
		var ne = {} , se = {} , sw = {} , nw = {},
			adjacent = this.adjacent( x , y ),
			extraTurn = false ,
			draws = 0 ,
			activated = false ;

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

		[ nw , ne , se , sw ].forEach( function( corner ) {
			if ( corner.corner.catalyst ) {
				activated = Object.keys( corner.adjacent ).some( function( dir ) {
					return corner.adjacent[ dir ] && corner.adjacent[ dir ].micropul;
				});

				if ( activated ) {
					corner.corner.draws && ( draws += corner.corner.draws );
					corner.corner.extraTurn && ( extraTurn = true );
				}
			}

			if ( corner.corner.micropul ) {
				Object.keys( corner.adjacent ).forEach( function( dir ) {
					if ( corner.adjacent[ dir ] && corner.adjacent[ dir ].catalyst ) {
						corner.adjacent[ dir ].draws && ( draws += corner.adjacent[ dir ].draws );
						corner.adjacent[ dir ].extraTurn && ( extraTurn = true );
					}
				});
			}
		});

		return ( { draws : draws , extraTurn : extraTurn } );
	};



	Board.prototype.tryMove = function( tile , x , y ) {
		var result = {};
		result.success = this.validateMove( tile , x , y );
		if ( result.success ) {
			this.insert( tile , x , y );
			result.catalysts = this.activateCatalysts( tile , x , y );
		}
		return result;
	};





	return Board;

} () );

var deck = function() {
	var tiles = 'w   w . w  .w. +w.. w:. wb +wb. ww. ww :w w w b.w+w.w.b.+wbw.wbwwww.wwb:wwbwwbwbwwbbwwwwb   b . b  .b. +b.. b:. bw +bw. bb. bb :b b b w.b+b.b.w.+bwb.bwbbbb.bbw:bbwbbwbwbbbbbbww';
	return chunks( tiles , 4 ). map( function( corners ) {
		corners = corners.map( function( c ) {
			return ( c === 'w' ? corner.white :
					 c === 'b' ? corner.black :
					 c === ' ' ? corner.blank :
					 c === '.' ? corner.one :
					 c === ':' ? corner.two :
					 c === '+' ? corner.plus : '?' );
		});
		return Tile( { nw : corners[0] , ne: corners[1] , se : corners[2] , sw : corners[3] } );
	} );
};

var Player = ( function() {
	function Player(){
		if ( !( this instanceof Player ) ) {
			return new Player();
		}
		this.supply = [];
		this.hand = [];
		this.stones = 3;
	}
	return Player;
} () );

var Game = ( function () {
	function Game() {
		if ( !( this instanceof Game ) ) {
			return new Game();
		}
		this.core = deck();
		this.board = Board();
		this.board.insert( this.core.pop() , 0 , 0 );
		shuffle( this.core );
	};

	Game.prototype.draw = function( n ){
		return ( n === 0 || !this.core.length ) ? [] :
			[ this.core.pop() ].concat( this.draw( n - 1 ) );
	};



	return Game;
}() );