/*global define*/

define( function() {

	function Board() {
		var bounds = { x: { min: 0 , max: 0} , y: { min: 0 , max: 0} },
			stones = [],
			tiles = [];

		return {

			adjacent: function( x , y ){
				var nsCol, eCol, wCol, adjacent = {};

				nsCol = tiles[ x ];
				eCol = tiles[ x + 1 ];
				wCol = tiles[ x - 1 ];

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
				tiles[ x ]  = tiles [ x ] || {};
				tiles[ x ][ y ] = tile;
				tile.board = this;
				tile.position = { x: x , y: y };

				this.updateBounds( x , y );
			},
			at: function( x , y ) {
				return tiles[ x ]  && tiles[ x ][ y ];
			},
			updateBounds: function( x , y ){
				bounds.x.min = Math.min( bounds.x.min , x );
				bounds.x.max = Math.max( bounds.x.max , x + 1 );

				bounds.y.min = Math.min( bounds.y.min , y );
				bounds.y.max = Math.max( bounds.y.max , y + 1 );
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

				for ( j = bounds.y.min ; j < bounds.y.max ; ++j ) {

					for ( lower = 0 ; lower < 2 ; ++lower ) {

						for ( i = bounds.x.min ; i < bounds.x.max ; ++i ) {
							tile = tiles[ i ][ j ];

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
					activated = false ,
					bigCatalysts ,
					adjacentBigCatalystActivators;

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


				bigCatalysts = { c: tile.bigTile ? { catalyst: tile.bigTile.catalyst ,
													 activated: [ nw , ne , se , sw ].some( function ( corner ) {
														 return Object.keys( corner.adjacent ).some( function( dir ) {
															 return corner.adjacent[ dir ] && corner.adjacent[ dir ].micropul;
														 });
													 })
												   } : undefined ,
								 n: adjacent.n && adjacent.n.bigTile ?
								 { catalyst: adjacent.n.bigTile.catalyst ,
								   activated: !!ne.corner.micropul || !!nw.corner.micropul
								 } : undefined ,
								 w: adjacent.w && adjacent.w.bigTile ?
								 { catalyst: adjacent.w.bigTile.catalyst ,
								   activated: !!nw.corner.micropul || !!sw.corner.micropul
								 } : undefined ,
								 s: adjacent.s && adjacent.s.bigTile ?
								 { catalyst: adjacent.s.bigTile.catalyst ,
								   activated: !!sw.corner.micropul || !!se.corner.micropul
								 } : undefined ,
								 e: adjacent.e && adjacent.e.bigTile ?
								 { catalyst: adjacent.e.bigTile.catalyst ,
								   activated: !!ne.corner.micropul || !!se.corner.micropul
								 } : undefined
							   };

				Object.keys( bigCatalysts ).forEach( function ( dir ) {
					if ( bigCatalysts[ dir ] && bigCatalysts[ dir ].activated ) {
						bigCatalysts[ dir ].catalyst.draws && ( draws += bigCatalysts[ dir ].catalyst.draws );
						bigCatalysts[ dir ].catalyst.extraTurn && ( extraTurn = true );
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
			},


			findConnected: function( x , y , corner ) {

				// find recursive works in doubled space
				function findConnectedRecursive( working , connected ) {
					var potentiallyUnvisited = [];

					working.forEach( function ( coords ) {

						var adjConnected =
								adjacentInDoubled( coords ).filter( function( adjCoords ) {

									var corner = this.cornerAtDoubled( adjCoords );
									return corner &&  corner.micropul && ( corner === origCorner );

								}.bind( this ));

						potentiallyUnvisited = potentiallyUnvisited.concat( adjConnected );

						connected[ coords.x + ',' + coords.y ] = coords;

					}.bind( this ) );

					working = potentiallyUnvisited.filter( function ( coord ) {
						return !connected[ coord.x + ',' + coord.y ];
					} );

					if ( working.length )
						findConnectedRecursive.call( this , working , connected );
				}

				var origCorner = this.at( x , y ).corners[ corner ] ,
					connected = {},
					working = [ tileToDoubledCoords( { x: x , y: y , corner: corner } ) ];

				findConnectedRecursive.call( this , working , connected );

				return Object.keys( connected ).map(
					function( key ) {
						return doubledCoordsToTile( connected[ key ] );
					});

			},

			validateStonePlacement: function( x , y , corner , player ) {
				if ( ! this.at( x , y ).corners[ corner ].micropul  ) {
					return false;
				}

				var connected = this.findConnected( x , y , corner );
				if ( stones.some( function( stone ) {
					return connected.some( function( coords ) {
						var match = stone.coords.x === coords.x &&
							stone.coords.y === coords.y &&
							stone.coords.corner === coords.corner;
						return match;
					});
				}) ) {
					return false;
				}

				return true;
			},

			tryPlaceStone: function( x , y , corner , player ) {
				var result = {};
				result.success = this.validateStonePlacement( x , y , corner , player );
				if ( result.success ) {
					result.stone = { player: player, board: this , coords: { x: x , y: y , corner: corner } };
					this.placeStone( result.stone );
				}
				return result;
			} ,

			placeStone: function( stone ) {
				stones.push( stone );
			},

			cornerAtDoubled: function( coords ) {
				var x = coords.x , y = coords.y ,
					tileCoords = doubledCoordsToTile( { x: x , y: y } ),
					tile = this.at( tileCoords.x , tileCoords.y );

				return tile && tile.corners[ tileCoords.corner ];
			}
		};

		function adjacentInDoubled( doubledCoords ) {
			var adjacent = [];
			[ -1 , 1 ].forEach( function ( offset ) {
				adjacent.push( {x: doubledCoords.x + offset , y: doubledCoords.y  } );
				adjacent.push( {x: doubledCoords.x  , y: doubledCoords.y + offset  } );
			});
			return adjacent;
		}

		function tileToDoubledCoords( tileCoords ) {
			var x = tileCoords.x ,
				y = tileCoords.y ,
				corner = tileCoords.corner,
				xOffset = corner[0] === 'w' ? 0 : 1 ,
				yOffset = corner[0] === 'n' ? 0 : 1;

			return { x : 2 * x + xOffset ,
					 y : 2 * y + yOffset };
		}

		function doubledCoordsToTile( doubledCoords ) {
			var x = Math.floor( doubledCoords.x / 2 ),
				y = Math.floor( doubledCoords.y / 2 ) >> 0,
				corner = "";

			corner += ( doubledCoords.y % 2 === 0 ? "n" : "s" ) +
				( doubledCoords.x % 2 === 0 ? "w" : "e" );

			return { x: x , y: y , corner: corner };
		}

	};



	return Board;


});
