var board = new Board();
board.insert( Tile( {ne: 0, se: 0, sw: 0, nw: 0} ) , 0 , 0 );
board.insert( Tile( {ne: 1, se: 1, sw: 0, nw: 0} ) , 1 , 0 );
board.insert( Tile( {ne: -1, se: -1, sw: 0, nw: 0} ) , -1 , 0 );
board.insert( Tile( {ne: 0, se: 0, sw: 1, nw: 1} ) , 0 , 1 );
board.insert( Tile( {ne: 0, se: 0, sw: 1, nw: -1} ) , 0 , -1 );
board.insert( Tile( {ne: 1, se: 1, sw: 1, nw: 1} ) , 1 , 1 );
