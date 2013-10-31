var board = new Board();
board.insert( Tile( {nw: corner.white, ne: corner.black, se: corner.black, sw: corner.white} ) , 0 , 0 );
board.insert( Tile( {nw: corner.white, ne: corner.white, se: corner.blank, sw: corner.white} ) , -1 , 0 );
board.insert( Tile( {nw: corner.black, ne: corner.white, se: corner.blank, sw: corner.blank} ) , 0 , 1 );

// board.insert( Tile( {ne: 1, se: 1, sw: 0, nw: 0} ) , 1 , 0 );
// board.insert( Tile( {ne: -1, se: -1, sw: 0, nw: 0} ) , -1 , 0 );
// board.insert( Tile( {ne: 0, se: 0, sw: 1, nw: 1} ) , 0 , 1 );
// board.insert( Tile( {ne: 0, se: 0, sw: 1, nw: -1} ) , 0 , -1 );
// board.insert( Tile( {ne: 1, se: 1, sw: 1, nw: 1} ) , 1 , 1 );
board.insert( Tile( {nw: corner.black, ne: corner.white, se: corner.blank, sw: corner.blank} ) , 1 , 0 );
console.log( board.toString() );
