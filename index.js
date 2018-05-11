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

function getLocationDetails(zipcode){
  const geocode_query = {
      address: zipcode
    };
  $.getJSON(geoCodeEndpoint, geocode_query, getCoOrdinates);
}

function getCoOrdinates(data){
  if(data.status === "OK"){
    $('.js-results').prop('hidden', false);
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

    let service = new google.maps.places.PlacesService(map);
    service.textSearch(queryObj, displayRestaurantListings);
  }
 
}

function displayRestaurantListings(dataResults, status){
  if(status === google.maps.places.PlacesServiceStatus.OK){
    $('#restaurantListings').html('');
    for(let i=0;i<dataResults.length;i++){
      let marker = new google.maps.Marker({
            map:map,
            title:dataResults[i].name,
            position: dataResults[i].geometry.location
          });

      let  $rowHtml = $(`<div class="rowClass">
                        <div class="nameClass">${dataResults[i].name}</div>
                        <p>${dataResults[i].formatted_address}</p>
                      </div>`);
      $("#restaurantListings").append($rowHtml);
        
      let request = {
        placeId : `${dataResults[i].place_id}`
      };
      
      
      let contentString = `<div><h2>
                              ${dataResults[i].name}</h2>
                              <span><strong>Rating : </strong>${dataResults[i].rating}</span>
                            </div>`;

      let infoWindow = new google.maps.InfoWindow({
        content: contentString
      });

      marker.addListener('click', function(){  
        infoWindow.open(map, marker);
      });

      $rowHtml.click(function(){   
        infoWindow.open(map, marker);
      });

    }
  } 
}

$(function(){
  handleSubmit();
  getLocationDetails(92882);
});