'use strict'

var Polino = {
    Lines : [],
    Network : [],
    Itinerary : [],
    Timetable : [],
    getLines : function() {
        return $.ajax({
            url: "https://tsvc.pilote4.cityway.fr:443/api/transport/v3/line/GetLines/json",
            async : true
        }).then(function(data) {
           Polino.Lines = data.Data;
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
    fillLines : function() {
        for(var i = 0; i < Polino.Lines.length; i++) {
            if(Polino.Lines[i].Operator.Code == "AIXENBUS") {
                $("#select-line").append("<option value=" + Polino.Lines[i].Id + ">" + Polino.Lines[i].Code + "</option>");
            }
        }
    },
    displayTimetable : function(stopId, stopName, output) {
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
        for(var i = 0; i < departure.length && i < 3; i++) {
            timeString += departure[i] + "<br />";
        }

        var contentString = '<div id="content">'+
                                '<div id="stopInfo">'+
                                    '</div>'+
                                        timeString +
                                    '</div>'+
                                '</div>'+
                            '</div>';
        
        console.log(contentString);
        $(output).append(contentString);
        var date = new Date();
        date.setHours(parseInt(departure[0].split(":")[0]));
		date.setMinutes(parseInt(departure[0].split(":")[1]));
        $.initCompteRebours($("body"), date);
    }
};

$(function() {
    var promises = [];
    promises.push(Polino.getTimetable(399, 2));
    $.when.apply($, promises).done(function() {
        $("#loader-background").hide();
        Polino.displayTimetable(1057710, "Galilée", "#timetable-18");
        promises.push(Polino.getTimetable(2542, 2));
        $.when.apply($, promises).done(function() {
            $("#loader-background").hide();
            Polino.displayTimetable(1057710, "Marseille", "#timetable-50");
        });
    });
});