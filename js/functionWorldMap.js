//===========================================================================================================

// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.

// (1) Initialize the base maps

var styles = [
    {
      stylers: [
        { hue: "#0000e6" },
        { saturation: -50 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
 
function initMap() {

  var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: {lat: 42.323528, lng: -71.052351},
	mapTypeControlOptions:{
		mapTypeIds:[google.maps.MapTypeId.ROADMAP, 'map_style']
	},
	panControl: false,
    zoomControl: true,
    scaleControl: true
  });
  
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  //setMarkers(map);
  callJSONfile(map);  
}


// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
// var beaches = [
  // ['Bondi Beach', -33.890542, 151.274856, 4],
  // ['Coogee Beach', -33.923036, 151.259052, 5],
  // ['Cronulla Beach', -34.028249, 151.157507, 3],
  // ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
  // ['Maroubra Beach', -33.950198, 151.259302, 1]
// ];


function callJSONfile(map){

		var xmlhttp = new XMLHttpRequest();
		var url = "http://localhost:8080/CDC_MarkersConcept/data/POP2010.json";
		//var url =  "http://api.worldbank.org/countries?date=2010&format=json&per_page=300";

		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				setMarkers(xmlhttp.responseText,map);
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
}


function setMarkers(response, map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  var image = {
    url: 'images/beachflag.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };
  
  
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  
  
  var infowindow = new google.maps.InfoWindow({
    maxWidth: 200
	});

  var countries = JSON.parse(response);
  
  var contentArray = new Array();
  var markers = [];
  
  for (var i = 0; i < countries[1].length; i++) {
  
    var country = countries[1][i];
	
    var marker = new google.maps.Marker({
      position: {lat: parseFloat(country.latitude), lng: parseFloat(country.longitude)},
      //map: map,
      //icon: image,
      //shape: shape,
      title: country.name,
	  visible: true
    });
	
	
	var contentInfoBox = '<h1>'+ country.name
	+'</h1> <div>Region: '+ country.region.value
	+'</div><div>Capital: '+ country.capitalCity
	+'</div><div>Income Level: '
	+ country.incomeLevel.value +'</div>';

	
	markers.push(marker);
	contentArray.push(contentInfoBox);
	
	google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(contentArray[i]);
          infowindow.open(map, marker);
        }
      })(marker, i));

  }
  var mcOptions = {gridSize: 50, maxZoom: 32};
  
  var markerCluster = new MarkerClusterer(map, markers,mcOptions);
}

//===========================================================================================================
