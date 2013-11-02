/*global define*/

define( ['utils' , 'Tile' , 'corner' ] ,  function( utils , Tile, corner ){
	var deck = function() {
		var tiles = 'w   w . w  .w. +w.. w:. wb +wb. ww. ww :w w w b.w+w.w.b.+wbw.wbwwww.wwb:wwbwwbwbwwbbwwwwb   b . b  .b. +b.. b:. bw +bw. bb. bb :b b b w.b+b.b.w.+bwb.bwbbbb.bbw:bbwbbwbwbbbbbbww';
		return utils.chunks( tiles , 4 ). map( function( corners ) {
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

	return deck;
});
