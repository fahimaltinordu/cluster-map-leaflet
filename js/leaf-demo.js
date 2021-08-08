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
      $('#loader-area').fadeOut(); // başarılı lokasyon erişiminden sonra loading ikon kaldırır


      //lat-long info for bottom
      document.getElementById('currentlocation').innerHTML=`latitude: ${position.coords.latitude.toFixed(6)} || longitude: ${position.coords.longitude.toFixed(6)}`;
      
      
      //leaflet.js map tracking
      var mymap = L.map('map', {
          center: [position.coords.latitude, position.coords.longitude],
          maxZoom: 18,
          minZoom: 2,
          zoom: 18,
      });
      mymap.locate({ watch: true}); //for realtime tracking 

      var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);

      var circle = L.circle([position.coords.latitude, position.coords.longitude], { 
          color: '#3388ff', 
          radius: 20.0 }).addTo(mymap);
      
      function onLocationFound(e) {
          var lat = (e.latlng.lat);
          var lng = (e.latlng.lng);
          var newLatLng = new L.LatLng(lat, lng);
          marker.setLatLng(newLatLng); 
          circle.setLatLng(newLatLng); 
      }
      mymap.on('locationfound', onLocationFound);  




      //OPENSTREETMAP TILE
      const titleURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = '© OpenStreetMap';
      const tiles = L.tileLayer(titleURL, {
              attribution,

      });
      tiles.addTo(mymap);

      //harita tile yüklenirken loading ekranı gösterme
      tiles.on('loading', function (event) {
        $('#loader-area').fadeIn(); 
      });
      tiles.on('load', function (event) {
        $('#loader-area').fadeOut(); 
      });

      //cluster part
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
    $('#loader-area').fadeOut(); // lokasyon iznindeki sorunlarda loading ikon kalkar
    
    //izin alamazsa map-container dan map divini kaldırır
    let d = document.getElementById("map-container");
    let d_nested = document.getElementById("map");
    d.removeChild(d_nested);
    
    //izin alamazsa map-container'a izin için buton ekler
    var permissionBtn = document.createElement("button");
    permissionBtn.setAttribute("id", "permissionButton");
    var textBtn = document.createTextNode("Get Permission");
    permissionBtn.appendChild(textBtn);
    document.getElementById("map-container").appendChild(permissionBtn);

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



