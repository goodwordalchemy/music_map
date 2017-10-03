
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

function formatDateForDatePicker(date){
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1;
    month = month.toString();
    if (month.length === 1){
        month = '0' + month;
    }

    var day = date.getDate() + 1;
    day = day.toString();
    console.log('day', day)
    if (day.length === 1){
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;
}

function initMap() {
    today = new Date();
    twoMonthsFromNow = new Date(new Date().setDate(today.getDate() + 60));

    todayStr = formatDateForDatePicker(today);
    twoMonthsFromNowStr = formatDateForDatePicker(twoMonthsFromNow);
    
    // sets default dates
    startDateElt = document.getElementById('start_date');
    endDateElt = document.getElementById('end_date');

    start_date = startDateElt.value || todayStr;
    startDateElt.value = start_date;

    end_date = endDateElt.value || twoMonthsFromNowStr;
    endDateElt.value = end_date;

    $.getJSON(
        '/api/get_user_events_list',
        {
            'start_date': start_date,
            'end_date': end_date
        },
        populate_map
    );
}

