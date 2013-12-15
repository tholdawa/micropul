/*global define*/
"use strict";
define(
    ['QUnit' ,'Game'],
    function(QUnit , Game) {
        var run = function() {
            QUnit.test('Testing game init', function(assert) {
				var game = Game();
                assert.equal( game.board.toString() , 'bb\nww\n', 'Board should start with starting tile.');
            });
        };
        return {run: run}
    }
);
