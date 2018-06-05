const geoCodeEndpoint = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB7B_ofAzLU1alRq_vQhShyIuJZdpL_k_M";

const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 33
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f2e5d4"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5dac6"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5c6c6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e4d7c6"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fbfaf7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#acbcc9"
      }
    ]
  }
];

const nightStyles = [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ];

let map;
let zipcode;
let latLng;
const infoWindow = new google.maps.InfoWindow();


function handleSubmit(){
  $('.query-form').submit((event) => {
    event.preventDefault();
    zipcode = $("#zipcode").val();
    getLocationDetails(zipcode);
  //  
  });
}

function getLocationDetails(){
  const geocode_query = {
      address:zipcode
    };
   
  $.getJSON(geoCodeEndpoint, geocode_query, getCoOrdinates);
}

function getCoOrdinates(data){
  if(data.status === "OK"){
    const coords =  data.results[0].geometry.location;
    latLng = coords;        

    searchForAllRestaurants(coords);   
  } 
}

function noResultsHTML(){
  let result = "<li><div class='noResults'>No results found.</div></li>";
  $('#restaurantListings').append(result);
}

function searchForAllRestaurants(coords){
  const styledMapType = new google.maps.StyledMapType(mapStyle, {name: 'Styled Map'});

  const nightStyleMap = new google.maps.StyledMapType(nightStyles,{name:'Night Map'});

  map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 8,
      mapTypeControlOptions: {
            mapTypeIds: ['styled_map', 'night_map']
      },
      zoomControl:false,
      mapTypeControl:false,
      rotateControl:false,
      fullscreenControl:false
    });

  map.mapTypes.set('styled_map', styledMapType);
  map.mapTypes.set('night_map', nightStyleMap);

  const hours = new Date().getHours();

  if(hours > 6 && hours < 20){
    map.setMapTypeId('styled_map');
  }else{
    map.setMapTypeId('night_map');
  }
  
  const openNow = $('#openNow:checked') .val();
  const distanceInMeters = Math.floor($('#distance').val() * 1609.344);
  const cuisine = $('#cuisine').val();
  const vegetarian = $('#vegetarian:checked').val();
  const vegan = $("#vegan:checked").val();
  
  let str = 'restaurants+near+' + zipcode;

  if(cuisine !== "all"){
    str = cuisine + "+" + str;
  }
  if(vegetarian === "on"){
    str = "vegetarian+" + str;
  }
  if(vegan === "on"){
    str = "vegan+" + str;
  }
  
  const queryObj = {      
    query: str,
    location : coords,
    radius: distanceInMeters      
  };

  if(openNow === "on"){
    queryObj.openNow = true;   
  }  
    
  const service = new google.maps.places.PlacesService(map);
  service.textSearch(queryObj, getRestaurantListings);
  resetQueryForm();  
}

function resetQueryForm(){
  $('#zipcode').val('');
 /* $('#distance').val('');
  $('#cuisine').val(1);*/
  $('select option:first-child').prop("selected", "selected");
  $('#vegetarian').prop('checked', false);
  $('#vegan').prop('checked', false);
  $('#openNow').prop('checked', false);
}

function getRestaurantListings(dataResults, status){
  if(dataResults.length === 0){
    noResultsHTML();
  }else{
    if(status === google.maps.places.PlacesServiceStatus.OK){
    
      resetRestaurantListings();    
      
      for(let i=0;i<dataResults.length;i++){                
        const placeDetailsQuery = {
          placeId: dataResults[i].place_id
        };          
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(placeDetailsQuery, getPlaceDetails);  
      }
      map.setCenter(dataResults[0].geometry.location);
      map.setZoom(13) ;
    } 
  }    
}

function createMarker(map, restaurant){
  return new google.maps.Marker({
            map:map,
            title:restaurant.name,
            position: restaurant.geometry.location,
            icon: 'restaurant.png'
          });
}

function restaurantRowHTML(restaurant){
  const width = restaurant.photos[0].width;
  const height = restaurant.photos[0].height;  
  return  $(`<li >
              <div class="rowClass">
              <div class="rowImage">
                <img id='restaurantImg' src=${restaurant.photos[0].getUrl({'maxWidth':width, 'maxHeight': height})} alt='${restaurant.name}' />
              </div>
              <div class="nameDiv">
                <div class="nameClass">
                <h4>${restaurant.name}</h>
                <h5>${restaurant.formatted_address}</h5>
                </div>
              </div>
              </div>              
            </li>`);
}

function resetRestaurantListings(){
  $('#restaurantListings').html('');
}

function createMarkerContent(restaurant){
  const width = restaurant.photos[0].width;
  const height = restaurant.photos[0].height;
  let url = restaurant.website;
  if(url === undefined){
    url = restaurant.url;
  }

  let starString = "<div class='rating'>";
  const rating = Math.floor(restaurant.rating);

  for (var j = 0; j < rating ; j++) {
    starString += '<i class="fa fa-star" aria-hidden="true"></i>';
  }

  starString += '</div>';
 
  const contentString = `<div id='contentDiv'>
                          <div id='imgDiv'>
                            <img id='restaurantImg1' src=${restaurant.photos[0].getUrl({'maxWidth':width, 'maxHeight': height})} alt='${restaurant.name}' />
                          </div>
                          <div id='infoDiv'>
                            <h2>${restaurant.name}</h2>
                            ${starString}
                            <h4>${restaurant.formatted_phone_number}</h3>
                            <h4><a href='${restaurant.url}' target='_blank'>${restaurant.url}</a></h3> 
                          </div>
                        </div>`;
                            
  return contentString;
}

function getPlaceDetails(place, status){ 
  if(status === google.maps.places.PlacesServiceStatus.OK){
    if(place !== null){
      const marker = createMarker(map, place);              
      marker.addListener('click', function(){          
        createInfoWindow(marker, place);
      });      
      const $rowHtml = restaurantRowHTML(place);       
      $("#restaurantListings").append($rowHtml);
      $rowHtml.click(function(){          
        createInfoWindow(marker, place);
        $('html, body').animate({scrollTop:0}, 'slow');
      });
    }      
  }      
}

function createInfoWindow(marker, place){
  infoWindow.close();      
  infoWindow.setContent(createMarkerContent(place));
  infoWindow.open(map, marker); 
}

function getPosition(position){
  const latLngObj = {
    lat: position.coords.latitude,
    lng:position.coords.longitude
  }  
  searchForAllRestaurants(latLngObj);
}
function error(){  
}

$(function(){
  handleSubmit();  
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getPosition, error);
  }
});