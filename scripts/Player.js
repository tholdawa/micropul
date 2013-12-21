/*global define*/

define( function(){
	function Player( game ){
		return {
			supply: [],
			hand: [],
			unplacedStones: 3 ,
			placedStones: [],
			game: game ,
			draw: function( n ) {
				this.supply = this.supply.concat( this.game.draw( n ) );
			},
			drawToHand: function( n ) {
				this.hand = this.hand.concat( this.game.draw( n ) );
			},
			supplyToHand: function() {
				if ( this.supply.length && this.hand.length < this.game.MAX_HAND_SIZE ) {
					this.hand.push( this.supply.pop() );
					return true;
				}
				return false;
			}
		};
	}
	return Player;
});
