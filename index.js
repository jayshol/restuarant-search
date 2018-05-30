const geoCodeEndpoint = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB7B_ofAzLU1alRq_vQhShyIuJZdpL_k_M";

const vegFriendlyEndpoint = "https://www.vegguide.org/search/by-lat-long/";

const veg_filter = "/filter/category_id=1;veg_level=4;distance=";

let map;
let zipcode;
let latLng;

function handleSubmit(){
  $('.query-form').submit((event) => {
    event.preventDefault();
    zipcode = $("#zipcode").val();
    getLocationDetails(zipcode);
    $('#zipcode').val('');
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
   // console.dir(coords);
    /*
    if($('#vegVegan:checked').val() === "on"){
      searchForVegRestaurants(coords, cuisine);
    }else{
      searchForAllRestaurants(coords, cuisine);
    } 
    */    
  }
 
}
/*
function searchForVegRestaurants(coords, cuisine){
  // console.dir(coords);
  
  let searchEndpoint = vegFriendlyEndpoint + coords.lat + "," + coords.lng;
  searchEndpoint += veg_filter + $('#distance').val();
  // alert(searchEndpoint);
  $.getJSON(searchEndpoint, getVegRestaurants);

}

function getVegRestaurants(data){
  resetRestaurantListings();
  if(data.entry_count === 0){
    noResultsHTML();
  }else{
    for(let i=0;data.entries.length;i++){
      
    }
  }
}  */

function noResultsHTML(){
  let result = "<li><div class='noResults'>No results found.</div></li>";
  $('#restaurantListings').append(result);
}

function searchForAllRestaurants(coords){
  map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 8,
      mapTypeId: 'hybrid'
    });
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
    str = "vegan+" + str;
  }
   // alert(str)   ;
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
}

function getRestaurantListings(dataResults, status){
  if(dataResults.length === 0){
    noResultsHTML();
  }else{
    if(status === google.maps.places.PlacesServiceStatus.OK){
    
      resetRestaurantListings();    
      
      for(let i=0;i<dataResults.length;i++){

        //console.dir(dataResults[i]);
        
        const placeDetailsQuery = {
          placeId: dataResults[i].place_id
        };
        //console.dir(placeDetailsQuery);
  
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(placeDetailsQuery, getPlaceDetails);  
      }
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

function createInfoWindow(restaurant){
  const width = restaurant.photos[0].width;
  const height = restaurant.photos[0].height;
  let url = restaurant.website;
  if(url === undefined){
    url = restaurant.url;
  }
 
  const contentString = `<div id='contentDiv'>
                          <div id='imgDiv'>
                            <img id='restaurantImg1' src=${restaurant.photos[0].getUrl({'maxWidth':width, 'maxHeight': height})} alt='${restaurant.name}' />
                          </div>
                          <div id='infoDiv'>
                            <h2>${restaurant.name}</h2>
                            <span><strong>Rating : </strong>${restaurant.rating}</span>
                            <h3><strong>Phone: </strong>${restaurant.formatted_phone_number}</h3>
                            <h3>URL :${url}</h3> 
                          </div>
                        </div>`;
                        
  return new google.maps.InfoWindow({
    content: contentString
  });
}

function getPlaceDetails(place, status){
 // console.dir(place);
  if(status === google.maps.places.PlacesServiceStatus.OK){
    const marker = createMarker(map, place);
    
    console.dir(place);
    const infoWindow = createInfoWindow(place);

    marker.addListener('click', function(){  
      infoWindow.open(map, marker);
    });
      
    const $rowHtml = restaurantRowHTML(place); 
      
    $("#restaurantListings").append($rowHtml);

    $rowHtml.click(function(){   
      infoWindow.open(map, marker);
    });   
  }else{

  }
  map.setCenter(place.geometry.location);
  map.setZoom(13) ;
}

function getPosition(position){
  const latLngObj = {
    lat: position.coords.latitude,
    lng:position.coords.longitude
  }

  //console.dir(latLngObj);
  searchForAllRestaurants(latLngObj);
}
function error(){
  
}

$(function(){
  handleSubmit();
  // set some default zipcode for initial search
 // zipcode = 92882;
 // getLocationDetails();
 if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(getPosition, error);
 }
});