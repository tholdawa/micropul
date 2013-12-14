/*global define*/

define( function() {

	function Board() {
		return {
			bounds: { x: { min: 0 , max: 0} , y: { min: 0 , max: 0} },

			adjacent: function( x , y ){
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
			},
			insert: function( tile , x , y ) {
				this[ x ]  = this [ x ] || {};
				this[ x ][ y ] = tile;
				tile.board = this;
				tile.position = { x: x , y: y };

				this.updateBounds( x , y );
			},
			at: function( x , y ) {
				return this[ x ]  && this[ x ][ y ];
			},
			updateBounds: function( x , y ){
				this.bounds.x.min = Math.min( this.bounds.x.min , x );
				this.bounds.x.max = Math.max( this.bounds.x.max , x + 1 );

				this.bounds.y.min = Math.min( this.bounds.y.min , y );
				this.bounds.y.max = Math.max( this.bounds.y.max , y + 1 );
			},

			validateMove: function( tile , x , y ){
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

			},

			toString: function() {
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

			},

			activateCatalysts: function( tile , x , y ){
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
			},


			tryMove: function( tile , x , y ) {
				var result = {};
				result.success = this.validateMove( tile , x , y );
				if ( result.success ) {
					this.insert( tile , x , y );
					result.catalysts = this.activateCatalysts( tile , x , y );
				}
				return result;
			}
		};
	};




	return Board;


});
