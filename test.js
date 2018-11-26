var infowindow;

(function()

{
	google.maps.Map.prototype.markers=new Array();
	google.maps.Map.prototype.addMarker=function(marker){
		this.markers[this.markers.length]=marker;
	};
	google.maps.Map.prototype.getMarkers=function(){
		return this.markers
	};
		google.maps.Map.prototype.clearMarkers=function(){
			if(infowindow){
				infowindow.close();
			}
for(var i=0;i<this.markers.length;i++){
	this.markers[i].set_map(null);
}
};
})();

function initialize(){
	var latlng=new google.maps.LatLng(50.9406645,6.9599115);
	var myOptions={
		zoom:12,center:latlng,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	map=new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	var a=new Array();
	var t=new Object();
	t.name="test0"
t.lat=50.9407745
t.lng=6.9599200
a[0]=t;
var t=new Object();
t.name="test1"
t.lat=50.9507745
t.lng=6.9699200
a[1]=t;
var t=new Object();
t.name="test2"
t.lat=50.9307745
t.lng=6.9499200
a[2]=t;
for(var i=0;i<a.length;i++){
	var latlng=new google.maps.LatLng(a[i].lat,a[i].lng);
	map.addMarker(createMarker(a[i].name,latlng));}
console.log(map.getMarkers());console.log(map.getMarkers());}
function createMarker(name,latlng){
	var marker=new google.maps.Marker({position:latlng,map:map});
	google.maps.event.addListener(marker,"click",function(){
		if(infowindow)infowindow.close();
		infowindow=new google.maps.InfoWindow({content:name});
		infowindow.open(map,marker);});
	return marker;
}