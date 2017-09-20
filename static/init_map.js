
function populate_map(data) {
    var map_center = {city: "San Francisco, CA, US", lat: 37.7842566, lng: -122.4332961}

    var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 8,
         center: map_center
    });
    
    var infoWindowCallbacks = [];
    var markers = [];

    for (var event_idx in data) {
        var event = data[event_idx]

        var contentString = '<div>' +
            '<h1>' + event.displayName + '</h1>' +
            '<p>date: ' + event.start.date + ', ' + event.start.time + '</p>' +
            '<p>venue: ' + event.venue.displayName + '</p>' +
            '<p>songkick uri: ' + event.uri + '</p>' +
            '</div>'

        var infoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        var marker = new google.maps.Marker({
            position: event.location,
            map: map
        });

        markers[event_idx] = marker;

        infoWindowCallbacks[event_idx] = (function(marker, infoWindow) {
            return function () { 
                infoWindow.open(map, marker) 
            };
        })(marker, infoWindow);

   }

   for (var event_idx = 0; event_idx < data.length; event_idx++) {
        markers[event_idx].addListener('click', infoWindowCallbacks[event_idx]);
    }
}

function initMap() {
    $.getJSON(
        '/api/get_user_events_list',
        populate_map
    );
}

