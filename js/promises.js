function promiseGeoLocn() {

    // return a new promise
    return new Promise(function( resolve, reject ){

        // reject if geolocation isn't available
        if ( !navigator.geolocation ) reject( 'geolocation API not available' );

        // try and grab the current position
        navigator.geolocation.getCurrentPosition( resolve, reject );
    })
}


function promisePubs( map ) {
    
    // return new promise
    return new Promise(function( resolve, reject ){
        
        // set up request object
        var _request = {
            location: map.getCenter(),             
            keyword: 'pub',
            rankBy: google.maps.places.RankBy.DISTANCE
        }
        
        new google.maps.places.PlacesService( map ).nearbySearch( _request, function( res, status ){
            
            // resolve if status equals ok
            if (  status === google.maps.places.PlacesServiceStatus.OK ) {
                resolve( res );     
            } else {
                reject( 'places service is not OK' );
            }            
        
        });
    });
}



function promisePubDetails( id, map ) {
    
    // return new promise
    return new Promise(function( resolve, reject ){
         
        new google.maps.places.PlacesService( map ).getDetails( { placeId: id }, function( details, status ){
            
            // resolve if status equals ok
            if (  status === google.maps.places.PlacesServiceStatus.OK ) {
                resolve( details );     
            } else {
                reject( 'places service is not OK' );
            }  
        });

        
        
    });
    
}


/*
 * 
 * get things going
 * 
 * using asns code which requires a function to be called
 * 
 */
function mapsInit(){

    // set map in function scope.
    var map;
    
    
    promiseGeoLocn()

        .then(function( latLng ){
            // set the map options from the return geo data
            var _mapOpt = {
                    center: { lat: latLng.coords.latitude, lng: latLng.coords.longitude },
                    zoom: 17
                };  

            // create the map
            map = new google.maps.Map( document.querySelector( '.mapCanvas' ), _mapOpt );

            // return the pubs promise
            return promisePubs( map )
        })

        .then( function( pubs ){
            var info = new google.maps.InfoWindow();
            // loop through the pubs array
            // just replicating old behaviour for now
            pubs.forEach( function( pub ){
                var placeLoc = pub.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: pub.geometry.location
                });

                google.maps.event.addListener( marker, 'click', function(){
                    promisePubDetails( pub.place_id, map ).then(function( data ){
                        console.log( data );
                        window.test = data;
                    })
                })
            })

        })


}
















    




