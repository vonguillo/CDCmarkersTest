//===========================================================================================================

// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.

// (1) Initialize the base maps

var styles = [
    {
      stylers: [
        { hue: "#0000e6" },
        { saturation: -40 }
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
    zoom: 10,
    center: {lat: 42.323528, lng: -71.052351},
	mapTypeControlOptions:{
		mapTypeIds:[google.maps.MapTypeId.ROADMAP, 'map_style']
	}
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
		var url = "http://localhost:8080/JavascriptTutorial/data/potholes.json";

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
  
  var potholes = JSON.parse(response);
  
  var markers = [];
  
  for (var i = 0; i < potholes.features.length; i++) {
  
    var pothole = potholes.features[i];
	
    var marker = new google.maps.Marker({
      position: {lat: pothole.properties.LATITUDE, lng: pothole.properties.LONGITUDE},
      //map: map,
      //icon: image,
      //shape: shape,
      title: pothole.properties.TYPE,
	  visible: true
    });
	
	markers.push(marker);	
  }
  var markerCluster = new MarkerClusterer(map, markers);
}

//===========================================================================================================
