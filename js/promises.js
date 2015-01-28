// export promise module 
module.export = {
    
    promiseScript: function( url ) {
    
        // return a new promise
        return new Promise(function( resolve, reject ){

            // create the script element
            var scriptElm = document.createElement( 'script' );
            scriptElm.type = 'text/javascript';
            scriptElm.async = true;

            // reject onerror
            scriptElm.onerror = function( err ){
                reject( err );
            }

            // resolve onload
           scriptElm.onload = function(){
               resolve();
           }

           // do the stuff to actually get the script
           document.head.appendChild( scriptElm );
           scriptElm.src = url;

        });

    },
    
    promiseGeoLocn: function() {
    
        // return a new promise
        return new Promise(function( resolve, reject ){

            // reject if geolocation isn't available
            if ( !navigator.geolocation ) reject( 'geolocation API not available' );

            // try and grab the current position
            navigator.geolocation.getCurrentPosition( resolve, reject );
        })
    }
    
}



