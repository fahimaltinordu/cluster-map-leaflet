// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);


window.onload = () => {
  if( navigator.geolocation ) {
          const watchId = navigator.geolocation.watchPosition( success, fail );
  }
  else {
      alert("Sorry, your browser does not support geolocation services.");
  }

  function success (position) {
      //lat-long info for bottom
      document.getElementById('currentlocation').innerHTML=`latitude: ${position.coords.latitude.toFixed(6)} || longitude: ${position.coords.longitude.toFixed(6)}`;
      

        
      //leaflet.js map tracking
      var mymap = L.map('map', {
          center: [position.coords.latitude, position.coords.longitude],
          maxZoom: 18,
          minZoom: 3,
          zoom: 18,
      });
      // mymap.locate({setView: true, watch: true});


      L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);

      L.circle([position.coords.latitude, position.coords.longitude], { 
          color: '#3388ff', 
          radius: 20.0 }).addTo(mymap);

      //OPENSTREETMAP TILE
      const titleURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = '© OpenStreetMap';
      const tiles = L.tileLayer(titleURL, {
              attribution,

      });
      tiles.addTo(mymap);

      var myURL = jQuery('script[src$="leaf-demo.js"]')
        .attr('src')
        .replace('leaf-demo.js', '')

      var myIcon = L.icon({
        iconUrl: myURL + 'images/pin24.png',
        iconRetinaUrl: myURL + 'images/pin48.png',
        iconSize: [29, 24],
        iconAnchor: [9, 21],
        popupAnchor: [0, -14],
      })

      var markerClusters = L.markerClusterGroup()

      for (var i = 0; i < markers.length; ++i) {

        var m = L.marker([markers[i].lat, markers[i].lng], {
          icon: myIcon,
        })

        markerClusters.addLayer(m)
      }

      mymap.addLayer(markerClusters)
  }
  
  function fail (error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
          document.getElementById('currentlocation').innerHTML=`User denied Geolocation`;
              break;
          case error.POSITION_UNAVAILABLE:
          document.getElementById('currentlocation').innerHTML=`Unable to get your location`;
              break;
          case error.TIMEOUT:
          document.getElementById('currentlocation').innerHTML=`Runtime error`;
              break;
          case error.UNKNOWN_ERROR:
          document.getElementById('currentlocation').innerHTML=`Unknown error`;
              break;
      }
  }

}



