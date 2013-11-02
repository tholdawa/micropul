/*global define*/

define( function(){
	return {
		shuffle: function( arr ){
			var len = arr.length,
				i , j , tmp;
			for ( i = len - 1; i > 0 ; --i ) {
				j = Math.floor( Math.random() * ( i + 1 ) );
				tmp = arr[i];
				arr[i] = arr[j];
				arr[j] = tmp;
			}
		} ,

		chunks: function( array , size ) {
			var result = [], slice = [].slice, start = 0 , end = array.length;
			while ( start < end ) {
				result.push( slice.call( array , start , start + size ) );
				start += size;
			}
			return result;
		}
	};
});
