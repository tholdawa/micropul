/*global define*/

define( function(){
	function Player(){
		if ( !( this instanceof Player ) ) {
			return new Player();
		}
		this.supply = [];
		this.hand = [];
		this.stones = 3;
	}
	return Player;
});
