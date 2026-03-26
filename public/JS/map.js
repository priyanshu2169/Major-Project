maptilersdk.config.apiKey = Map_api;
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.OUTDOOR,
        center: [77.2088, 28.6139], // starting position [lng, lat]
        zoom: 14, // starting zoom
      });

    // create the popup
    const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
       `<h4>${location_for_geo}</h4><p>Exact location provided after booking</p>`
    );

      // Geocode the listing location and center the map on it
      if (location_for_geo) {
        const geocodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location_for_geo)}.json?key=${Map_api}`;
        
        fetch(geocodingUrl)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const coords = data.features[0].geometry.coordinates;
              map.easeTo({
                center: coords,
                zoom: 12,
                duration: 1000
              });
              
              const marker = new maptilersdk.Marker({color:"red"})
              .setLngLat(coords)
              .addTo(map)
              
              .setPopup(popup);
              
            }
          })
          
          .catch(error => console.error('Geocoding error:', error));


      }


