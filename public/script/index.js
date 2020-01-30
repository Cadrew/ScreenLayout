'use strict'

var Polino = {
    Lines : [],
    Network : [],
    Itinerary : [],
    Timetable : [],
    Stops : [],
    Markers : [],
    DirectionsService : "",
    DirectionsRenderer : "",
    getLines : function() {
        return $.ajax({
            url: "https://tsvc.pilote4.cityway.fr:443/api/transport/v3/line/GetLines/json",
            async : true
        }).then(function(data) {
           Polino.Lines = data.Data;
        });
    },
    getNetwork : function() {
        return $.ajax({
            url: "https://tsvc.pilote4.cityway.fr:443/api/transport/v3/line/GetLines/json",
            async : true
        }).then(function(data) {
           Polino.Network = data.Data;
        });
    },
    getItinerary : function(lineId) {
        return $.ajax({
            url: "https://tsvc.pilote4.cityway.fr/api/map/v2/GetItinerary/json?Line=" + lineId,
            async : true
        }).then(function(data) {
           Polino.Itinerary = data.Data;
        });
    },
    getTimetable : function(lineId, directionId) {
        return $.ajax({
            url: "https://tsvc.pilote4.cityway.fr:443/api/transport/v3/timetable/GetLineHours/json?LineId=" + lineId + "&Direction=" + directionId,
            async : true
        }).then(function(data) {
           Polino.Timetable = data.Data;
        });
    },
    getStops : function() {
        return $.ajax({
            url: "https://tsvc.pilote4.cityway.fr/api/transport/v3/stop/GetLineStops/json",
            async : true
        }).then(function(data) {
           Polino.Stops = data.Data;
        });
    },
    fillLines : function() {
        for(var i = 0; i < Polino.Lines.length; i++) {
            if(Polino.Lines[i].Operator.Code == "AIXENBUS") {
                $("#select-line").append("<option value=" + Polino.Lines[i].Id + ">" + Polino.Lines[i].Code + "</option>");
            }
        }
    },
    fillDirection : function() {
        $('#select-direction > option').each(function() {
            $(this).remove();
        });
        var destination = [];
        $("#select-direction").append("<option value=''>Sélectionnez une direction</option>");
        for(var i = 0; i < Polino.Itinerary.length; i++) {
            if(destination.indexOf(Polino.Itinerary[i].Destination) == -1) {
                destination.push(Polino.Itinerary[i].Destination);
                $("#select-direction").append("<option value=" + Polino.Itinerary[i].Id + ">" + Polino.Itinerary[i].Destination + "</option>");
            }
        }
    },
    replaceChar : function() {
        for(var i = 0; i < Polino.Itinerary.length; i++) {
            Polino.Itinerary[i].Destination = Polino.Itinerary[i].Destination.replace("Ã¨", "è");
            Polino.Itinerary[i].Destination = Polino.Itinerary[i].Destination.replace("Ã©", "é");
            Polino.Itinerary[i].Destination = Polino.Itinerary[i].Destination.replace("Ã´", "ô");
            Polino.Itinerary[i].Destination = Polino.Itinerary[i].Destination.replace("Ã¢", "â");
            Polino.Itinerary[i].Destination = Polino.Itinerary[i].Destination.replace("Ãª", "ê");
        }
    },
    getDirection : function() {
        var direction = 0;
        for(var i = 0; i < Polino.Itinerary.length; i++) {
            if(Polino.Itinerary[i].Id == $("#select-direction").val()) {
                direction = i;
                break;
            }
        }
        return direction;
    },
    calculateAndDisplayRoute : function(lat1, lng1, lat2, lng2) {
        Polino.DirectionsService.route(
            {
                origin: { query: "" + lat1 + "," + lng1 },
                destination: { query: "" + lat2 + "," + lng2 },
                travelMode: 'DRIVING'
            },
            function(response, status) {
                if (status === 'OK') {
                    Polino.DirectionsRenderer.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    },
    createMarker : function(lat, lng, stopId, stopName) {
        var marker = new google.maps.Marker({
            map: map,
            position: { lat : lat, lng : lng }
        });
        Polino.Markers.push(marker);
        var arrival = [];
        var departure = [];

        for(var i = 0; i < Polino.Timetable.Hours.length; i++) {
            if(Polino.Timetable.Hours[i].StopId == stopId) {
                var hours = Math.floor(Polino.Timetable.Hours[i].TheoricArrivalTime / 60);
                var minutes = Polino.Timetable.Hours[i].TheoricArrivalTime % 60;
                var a = "" + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
                hours = Math.floor(Polino.Timetable.Hours[i].TheoricDepartureTime / 60);
                minutes = Polino.Timetable.Hours[i].TheoricDepartureTime % 60;
                var d = "" + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
                arrival.push(a);
                departure.push(d);
            }
        }

        var timeString = "";
        for(var i = 0; i < departure.length; i++) {
            timeString += departure[i] + "<br />";
        }

        var contentString = '<div id="content">'+
                                '<div id="stopInfo">'+
                                    '</div>'+
                                        '<h1 id="firstHeading" class="firstHeading">' + stopName + '</h1>'+
                                        '<hr />'+
                                        '<h4>Prochains passages :</h4>'+
                                        timeString +
                                    '</div>'+
                                '</div>'+
                            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    },
    addMarkers : function() {
        var id = Polino.getDirection();        
        for(var i = 0; i < Polino.Itinerary[id].StopPoints.length; i++) {
            Polino.createMarker(Polino.Itinerary[id].StopPoints[i].Latitude, Polino.Itinerary[id].StopPoints[i].Longitude,
                Polino.Itinerary[id].StopPoints[i].Id, Polino.Itinerary[id].StopPoints[i].Name);
        }

        if(Polino.Markers.length == 1) {
        	var pt = new google.maps.LatLng(Polino.Markers[0].getPosition().lat(), Polino.Markers[0].getPosition().lng())
        	map.setCenter(pt);
        	map.setZoom(11);
        } else {        	
	        var bounds = new google.maps.LatLngBounds();
	        for(var i = 0; i < Polino.Markers.length; i++) {
	            bounds.extend(new google.maps.LatLng(Polino.Markers[i].getPosition().lat(), Polino.Markers[i].getPosition().lng()));
	        }
	        map.fitBounds(bounds);
        }
        /*
        for(var i = 0; i < Polino.Markers.length - 1; i++) {
            Polino.calculateAndDisplayRoute(Polino.Markers[i].getPosition().lat(), Polino.Markers[i].getPosition().lng(),
                                            Polino.Markers[i+1].getPosition().lat(), Polino.Markers[i+1].getPosition().lng())
        }*/
        $("#loader-background").hide();
    },
    cleanMarkers : function() {
        for (var i = 0; i < Polino.Markers.length; i++) {
            Polino.Markers[i].setMap(null);
        }
        Polino.Markers = [];
    }
};

$(function() {
    var promises = [];
    promises.push(Polino.getLines());
    $.when.apply($, promises).done(function() {
        $("#loader-background").hide();
        Polino.fillLines();
    });
    
    $("#select-line").change(function() {
        $("#loader-background").show();
        var lineId = $("#select-line").val();
        promises = [];
        promises.push(Polino.getItinerary(lineId));
        $.when.apply($, promises).done(function() {
            $("#loader-background").hide();
            Polino.replaceChar();
            Polino.fillDirection();
        });
    });

    $("#select-direction").change(function() {
        $("#loader-background").show();
        var lineId = $("#select-line").val();
        promises = [];
        promises.push(Polino.getTimetable(lineId, Polino.Itinerary[Polino.getDirection()].Direction));
        $.when.apply($, promises).done(function() {
            $("#loader-background").hide();
            Polino.cleanMarkers();
            Polino.addMarkers();
        });
    });

    $("#close-btn").click(function() {
        $("#sidebar").toggle("toggle");
    });

    $("#open-sidebar").click(function() {
        $("#sidebar").toggle("toggle");
    });
});