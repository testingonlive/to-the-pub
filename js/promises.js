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


function pubTemplate( obj ) {
    
    return '<img src="' + obj.img + '" alt="pub photo" />' + 
           '<span class="name">' + obj.name + '</span>';      
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
    var map,
        info = document.querySelector( '.pubinfo' );
    
    
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

            // for now just interested in the nearest pub
            // @TODO next / prev button
            var pub = pubs[ 0 ];

            return promisePubDetails( pub.place_id, map );            
        })
    
        .then( function( details ){
            
            var _pubObj = {
                img: details.photos[ 0 ].getUrl( { maxHeight: window.innerHeight, maxWidth: window.innerWidth } ),
                name: details.name
            }
            
            // set the info window conent
            info.innerHTML = pubTemplate( _pubObj );
        
        
            // give the pub a marker
            var pubMarker = new google.maps.Marker({
                map: map,
                position: details.geometry.location
            });
        
            // when its clicked we'll log some details
            google.maps.event.addListener( pubMarker, 'click', function(e){
                console.log( e );
                
                info.classList.add( 'clicked' );
                
            });
        
        
        })


}
















    




