function formatDateForDatePicker(date){
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1;
    month = month.toString();
    if (month.length === 1){
        month = '0' + month;
    }

    var day = date.getDate() + 1;
    day = day.toString();
    if (day.length === 1){
        day = '0' + day;
    }

    return year + '-' + month + '-' + day;
}


function getNDaysFromDate(date, ndays){
    date.setDate(date.getDate() + ndays);

    return date;
}


function populateMap(data) {
    var map_center = {city: "San Francisco, CA, US", lat: 37.7842566, lng: -122.4332961}

    var mapNode = document.getElementById('map');
    var map = new google.maps.Map(mapNode, {
        center: map_center,
        zoom: 4
    });

    /*
    This attaches the google maps object to the DOM element.  Without this, it's impossible to 
    access map properties.
    */
    mapNode.gMap = map;
    
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

        var now = new Date();
        var startDate = new Date(event.start.date);
        var color;
        if (startDate < getNDaysFromDate(now, 7)) { 
            color = 'red';
        } else if (startDate < getNDaysFromDate(now, 14)) {
            color = 'yellow';
        } else if (startDate < getNDaysFromDate(now, 21)) {
            color = 'green';
        } else {
            color = 'blue';
        }

        var marker = new google.maps.Marker({
            position: event.location,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 2,
                fillColor: color,
                strokeColor: color
            }
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


    map.addListener('idle', function(domEvent) {
        var filteredData = [];
        var bounds = map.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();

        for (var eventIdx = 0; eventIdx < data.length; eventIdx++) {
            var event = data[eventIdx];
            if (event.location.lat < ne.lat() &&
                event.location.lng < ne.lng() &&
                event.location.lat > sw.lat() &&
                event.location.lng > sw.lng()) 
            {
                filteredData.push(event);
            }
        }
        console.log(filteredData.length);

        // initialize table
        var tableDiv = document.getElementById('event_table');
        while (tableDiv.hasChildNodes()) {
            tableDiv.removeChild(tableDiv.lastChild);
        }

        var table = document.createElement('table');
        tableDiv.appendChild(table);

        // create table header
        var thead = document.createElement('thead');
        table.appendChild(thead);

        var headerTr = document.createElement('tr');
        thead.appendChild(headerTr);

        var columnNames = [
            'Name', 'Date', 'Location', 'Venue', 'songkick_uri'
        ];
        for (var i = 0; i < columnNames.length; i++){
            var td = document.createElement('td');
            headerTr.appendChild(td);

            td.appendChild(document.createTextNode(columnNames[i]));
        }
        
        // create tabel body
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (var i = 0; i < filteredData.length; i++) {
            event = filteredData[i];

            var cellElements = [
                event.displayName,
                event.start.date,
                event.location.city,
                event.venue.displayName,
                event.uri
            ];

            var tr = document.createElement('tr');
            tbody.appendChild(tr);

            for (var j = 0; j < cellElements.length; j++) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(cellElements[j]));

                tr.appendChild(td);
            }
        }
    })
}


function populateData(data) {
    populateMap(data);
}


function initMap() {
    var today = new Date();
    var twoMonthsFromNow = new Date(new Date().setDate(today.getDate() + 60));

    var todayStr = formatDateForDatePicker(today);
    var twoMonthsFromNowStr = formatDateForDatePicker(twoMonthsFromNow);
    
    // sets default dates
    var startDateElt = document.getElementById('start_date');
    var endDateElt = document.getElementById('end_date');

    var start_date = startDateElt.value || todayStr;
    startDateElt.value = start_date;

    var end_date = endDateElt.value || twoMonthsFromNowStr;
    endDateElt.value = end_date;

    $.getJSON(
        '/api/get_user_events_list',
        {
            'start_date': start_date,
            'end_date': end_date
        },
        populateData
    );
}

