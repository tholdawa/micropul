var board = new Board();
board.insert( Tile( {nw: corner.white, ne: corner.black, se: corner.black, sw: corner.white} ) , 0 , 0 );
board.insert( Tile( {nw: corner.white, ne: corner.white, se: corner.blank, sw: corner.white} ) , -1 , 0 );
board.insert( Tile( {nw: corner.black, ne: corner.white, se: corner.blank, sw: corner.blank} ) , 0 , 1 );
board.insert( Tile( {nw: corner.black, ne: corner.white, se: corner.blank, sw: corner.blank} ) , 1 , 0 );
board.insert( Tile( {nw: corner.plus , ne: corner.white , se: corner.black , sw: corner.one} ) , 0 , -1 );
board.insert( Tile( {nw: corner.one , ne: corner.two , se: corner.one , sw: corner.white} ) , -1 , -1 ) ;
console.log( board.toString() );
console.log( board.activateCatalysts( board.at( -1 , -1 ) , -1 , -1 ) );
