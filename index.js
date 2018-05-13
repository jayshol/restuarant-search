const geoCodeEndpoint = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB7B_ofAzLU1alRq_vQhShyIuJZdpL_k_M";

let map;
let zipcode;

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
    const str = 'restaurants+near+' + zipcode;
    map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 11
    });

    const queryObj = {      
      query: str,
      location : coords,
      radius:10      
    };
     
    const service = new google.maps.places.PlacesService(map);
    service.textSearch(queryObj, displayRestaurantListings);
  }
 
}

function displayRestaurantListings(dataResults, status){
  
  if(status === google.maps.places.PlacesServiceStatus.OK){
    
    resetRestaurantListings();
    
    for(let i=0;i<dataResults.length;i++){
      
      const marker = createMarker(map, dataResults[i]);
      
      const infoWindow = createInfoWindow(dataResults[i]);

      marker.addListener('click', function(){  
        infoWindow.open(map, marker);
      });
      
      const $rowHtml = restaurantRowHTML(dataResults[i]); 
      
      $("#restaurantListings").append($rowHtml);

      $rowHtml.click(function(){   
        infoWindow.open(map, marker);
      });

    }
  } 
}

function createMarker(map, restaurant){
  return new google.maps.Marker({
            map:map,
            title:restaurant.name,
            position: restaurant.geometry.location
          });
}

function restaurantRowHTML(restaurant){
  return  $(`<li class="rowClass">
              <div class="nameClass">${restaurant.name}</div>
              <p>${restaurant.formatted_address}</p>
            </li>`);
}

function resetRestaurantListings(){
  $('#restaurantListings').html('');
}

function createInfoWindow(restaurant){
  const contentString = `<div><h2>
                          ${restaurant.name}</h2>
                          <span><strong>Rating : </strong>${restaurant.rating}</span>
                        </div>`;
                        
  return new google.maps.InfoWindow({
    content: contentString
  });
}

$(function(){
  handleSubmit();
  // set some default zipcode for initial search
  zipcode = 92882;
  getLocationDetails();
});