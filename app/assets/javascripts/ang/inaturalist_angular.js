var iNatAPI = angular.module( "iNatAPI", [ ]);

iNatAPI.factory( "shared", [ "$http", "$rootScope",
function( $http, $rootScope ) {
  var basicGet = function( url ) {
    return $http.get( url, { cache: true } ).then(
      function( response ) {
        return response;
      }, function( errorResponse ) {
        // Handle error case
      }
    );
  };

  var processParams = function( p ) {
    var params = angular.copy( p );
    // deal with iconic taxa
    if (params._iconic_taxa) {
      var iconic_taxa = [];
      angular.forEach(params._iconic_taxa, function(selected, name) {
        if (selected) {
          iconic_taxa.push(name)
        }
      });
      params.iconic_taxa = iconic_taxa;
      delete params._iconic_taxa;
    }
    // deal with has
    var has = [], matches, keysToDelete = [];
    angular.forEach(params, function(v, k) {
      matches = k.match(/has_(\w+)/)
      if( matches && v ) {
        has.push( matches[1] );
        keysToDelete.push( k );
      }
    });
    params.has = has;
    // date types
    // this looks and feels horrible, but I'm not sure what the angular way of doing it would be
    // switch( params.dateType ) {
    //   case 'exact':
    //     keysToDelete = keysToDelete.concat([ "d1", "d2", "month" ]);
    //     break;
    //   case 'range':
    //     keysToDelete = keysToDelete.concat([ "on", "month" ]);
    //     break;
    //   case 'month':
    //     keysToDelete = keysToDelete.concat([ "on", "d1", "d2" ]);
    //     break;
    //   default:
    //     keysToDelete = keysToDelete.concat([ "on", "d1", "d2", "month" ]);
    // }
    // delete params.dateType;
    // switch( params.geoType ) {
    //   case 'place':
    //     keysToDelete = keysToDelete.concat([ "swlng", "swlat", "nelng", "nelat" ]);
    //     break;
    //   case 'map':
    //     var bounds = $rootScope.map.getBounds(),
    //         ne     = bounds.getNorthEast(),
    //         sw     = bounds.getSouthWest();
    //     params.swlng = sw.lng();
    //     params.swlat = sw.lat();
    //     params.nelng = ne.lng();
    //     params.nelat = ne.lat();
    //     keysToDelete.push("place_id")
    //     break;
    //   default:
    //     keysToDelete = keysToDelete.concat([ "swlng", "swlat", "nelng", "nelat", "place_id" ]);
    // }
    angular.forEach(keysToDelete, function(k) {
      delete params[k];
    });
    delete params.geoType;
    return params;
  };

  var numberWithCommas = function( num ) {
    if( !_.isNumber( num ) ) { return num; }
    return num.toString( ).replace( /\B(?=(\d{3})+(?!\d))/g, "," );
  };

  return {
    basicGet: basicGet,
    numberWithCommas: numberWithCommas,
    processParams: processParams
  }
}]);
