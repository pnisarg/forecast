$('document').ready(function(){

//    $('.result').hide();
    jQuery.validator.addMethod("noSpaces", function(value, element) {
        return this.optional(element) || value.trim().length > 0;
    });    //validates input against spaces

    //Form validation 
    $('#forecastForm').validate({
        rules:{
            streetAddress: {
                noSpaces: true,
                required: true
            },
            city: {
                noSpaces: true,
                required: true
            },
            state: "required"
        },
        messages: {
            streetAddress: "Please enter the street address",
            city: "Please enter the city",
            state: "Please select a state"
        },
        submitHandler: function(form){
            $.ajax({
                url: form.action,
                type: form.method,
                data: $(form).serialize(),
                success: successFunction,
                error: function(){
                    alert("Failed to submit form!");
                }
            });
        }
    });

    //clear form
    $('#clearButton').click(function(){
        var form = $('#forecastForm');
        form.validate().resetForm();
        form[0].reset();
        $('.result').hide();
    });
});

//Global Variables
var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var zoom           = 9; 
var timezone = '';

//Array for icon value mapping
var iconValue = {
    "clear-day" : "clear.png",
    "clear-night" : "clear_night.png",
    "rain" : "rain.png",
    "snow" : "snow.png",
    "sleet" : "sleet.png",
    "wind" : "wind.png",
    "fog" : "fog.png",
    "cloudy" : "cloudy.png",
    "partly-cloudy-day" : "cloud_day.png",
    "partly-cloudy-night" : "cloud_night.png"
};

function setImage(image){
    var imageUrl = "./images/" + iconValue[image];
    var img = '<img id="weatherIcon" src="'+imageUrl+'">';
    $('#weatherImage').html(img);
}

function setTemperature(result){
    var condition = result.currently.summary;
    city = $('#city').val().trim();
    var state = $('#state').val();
    var summary = condition +" in "+city+", "+state;
    var temperature = Math.round(result.currently.temperature);
    var lowTemp = Math.round(result.daily.data[0].temperatureMin);
    var highTemp = Math.round(result.daily.data[0].temperatureMax);
    $('#summary').html(summary);
    $('#temperature').html(temperature);
    if(unit =="us")
        $('#unit').html("&deg; F");
    else
        $('#unit').html("&deg; C");
    $('#lowTemp').html("L: "+lowTemp+"&deg;");
    $('#highTemp').html("H: "+highTemp+"&deg;");
}

function getPrecipitation(prep){
    var precipitation = "";
    prep = (unit=="si")?(prep/25.4):prep;
    if(prep >= 0 && prep < 0.002)
        precipitation = "None";
    else if(prep >= 0.002 && prep < 0.017)
        precipitation = "Very Light";
    else if(prep >= 0.017 && prep < 0.1)
        precipitation = "Light";
    else if(prep >= 0.1 && prep < 0.4)
        precipitation = "Moderate";
    else
        precipitation = "Heavy";
    return precipitation;
}

function setTableValues(result){
    var precipitation = "",windSpeed="", dewPoint="", visibility="";
    var prep = result.currently.precipIntensity;
    precipitation = getPrecipitation(prep);
    var rainChance = Math.round(result.currently.precipProbability * 100) +"%";
    var humidity = Math.round(result.currently.humidity * 100)+"%";
    var sunrise = result.daily.data[0].sunriseTime;
    sunrise = moment.unix(sunrise).tz(timezone).format("hh:mm A");
    var sunset = result.daily.data[0].sunsetTime;
    sunset = moment.unix(sunset).tz(timezone).format("hh:mm A");
    if(unit == "si"){
        windSpeed = (result.currently.windSpeed).toFixed(2) + " m/s";
        dewPoint =  (result.currently.dewPoint).toFixed(2) + "&deg C";
        visibility = (result.currently.visibility).toFixed(2) + " km";
    }else{
        windSpeed = (result.currently.windSpeed).toFixed(2) + " mph";
        dewPoint = (result.currently.dewPoint).toFixed(2) + "&deg F";
        visibility = (result.currently.visibility).toFixed(2) +" mi";
    }
    $('#precipitation').html(precipitation);
    $('#rainChance').html(rainChance);
    $('#windSpeed').html(windSpeed);
    $('#dewPoint').html(dewPoint);
    $('#humidity').html(humidity);
    $('#visibility').html(visibility);
    $('#sunrise').html(sunrise);
    $('#sunset').html(sunset);
}

//Generate content for rightNow Tab 
function generateRightNow(result){
    setImage(result.currently.icon);
    setTemperature(result);
    setTableValues(result);
}

//takes unix time stamp as input and returns human readable time in '10:10 PM' format 
function getHumanReadableTime(timestamp){
    var time = new Date(timestamp * 1000);
    var hour = time.getHours();
    var min = time.getMinutes();
    var flag = 0;
    if(hour>12){
        flag = 1;
        hour = hour % 12;
    }
    hour = hour<=9?("0"+hour):hour;
    min = min<=9?("0"+min):min;
    time = hour +":"+min;
    if(flag==1) time += " PM";
    else time += " AM";
    return time;
}

//Generate content for Next 24 Hours Tab 
function generateNext24(result){
    var hourly = result.hourly.data;
    var myTime = "", icon="";
    var hourlyWind, hourlyHumidity, hourlyVisibility,hourlyPressure;
    var accordData = [];
    var table = $('#next24HoursTable');
    table.html("");
    var deg,speedUnit, distanceUnit, pressureUnit;
    if(unit == "si"){
        deg = "C";
        speedUnit = "m/s";
        distanceUnit = "km";
        pressureUnit = "hPa";
    }else{
        deg = "F";
        speedUnit = "mph";
        distanceUnit = "mi";
        pressureUnit = "mb";
    }
    var row = "<tr class='blueHeader'><th>Time</th><th>Summary</th><th>Cloud Cover</th><th>Temp (&deg;"+deg+")</th><th>View Details</th></tr>";
    table.append(row);
    var collapseRow;
    for(var i=1; i<= 24; i++){
        targetDiv = "hourRow"+i;
        //        myTime = getHumanReadableTime(hourly[i].time);
        myTime = moment.unix(hourly[i].time).format("hh:mm A");
        icon = hourly[i].icon;
        cloudCover = Math.round(hourly[i].cloudCover * 100)+"%";
        temperature = (hourly[i].temperature).toFixed(2);
        hourlyWind = (hourly[i].windSpeed)+speedUnit;
        hourlyHumidity = Math.round(hourly[i].humidity * 100)+"%";
        hourlyVisibility = (hourly[i].visibility)+distanceUnit;
        hourlyPressure = (hourly[i].pressure)+pressureUnit;
        row = "<tr class='active'><td>"+myTime+"</td><td><img id='accordIconImage' src='./images/"+iconValue[icon]+"'></td><td>"+cloudCover+"</td><td>"+temperature+"</td><td> <a class='accordion-toggle' data-toggle='collapse' data-target='#"+targetDiv+"'><span class='glyphicon glyphicon-plus'></span></a></td></tr>";
        table.append(row);
        collapseRow = "<table class='table table-condensed'><tr><th>wind</th><th>Humidity</th><th>Visibility</th><th>Pressure</th></tr><tr><td>"+hourlyWind+"</td><td>"+hourlyHumidity+"</td><td>"+hourlyVisibility+"</td><td>"+hourlyPressure+"</td></tr></table>";
        row = '<tr><td colspan="5" class="hiddenRow"><div id="'+targetDiv+'" class="accordian-body collapse hiddenDiv">'+collapseRow+'</div></td></tr>';
        table.append(row);

    }
}

//creates seperate modal div for each day(7 divs)
function createModal(month, date, icon, day, modalId,condition,humidity,windSpeed, visibility,pressure,sunset,sunrise){

    var modalTitle = 'Weather in '+city+' on '+month+' '+date;
    var modalString = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="'+modalId+'Label" id="'+modalId+'" >';
    var modal = $(modalString);
    var modalDoc = $('<div class="modal-dialog" role="document">'); // modal document
    modal.append(modalDoc);
    var modalContent = $('<div class="modal-content">'); //modal content 
    modalDoc.append(modalContent);

    //Modal header 
    var modalHeader = '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">'+ modalTitle +'</h4></div>';
    modalContent.append(modalHeader); 

    //modal body
    var modalBody = $('<div class="modal-body">'); 
    var icon = '<div><img class="img-responsive modalIcon" src="'+icon+'"></div>';
    var summary = '<div class="modalSummary">'+day+': <span style="color:orange">'+condition+'</span></div>';
    var firstRow = '<div class="row" style="text-align:center;"><div class="col-md-4"><span class="bigFont">Sunrise Time</span><br>'+sunrise+'</div><div class="col-md-4"><span class="bigFont">Sunset Time</span><br>'+sunset+'</div><div class="col-md-4"><span class="bigFont">Humidity</span><br>'+humidity+'</div></div>';
    var secondRow = '<div class="row" style="text-align:center;"><div class="col-md-4"><span class="bigFont">Wind Speed</span><br>'+windSpeed+'</div><div class="col-md-4"><span class="bigFont">Visibility</span><br>'+visibility+'</div><div class="col-md-4"><span class="bigFont">Pressure</span><br>'+pressure+'</div></div>';
    modalBody.append(icon);
    modalBody.append(summary);
    modalBody.append(firstRow);
    modalBody.append(secondRow);
    modalContent.append(modalBody);
    //modal footer
    modalContent.append('<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>');
    $('#modals').append(modal);

}

//Generate content for Next 7 Days Tab 
function generateNext7(result){
    var dayBar = $('#weatherBarDiv');
    var timestamp, day, month, date, imageUrl, minTemperature, maxTemperature, image, modalId, row, condition, humidity,windSpeed, visibility,pressure, sunset, sunrise;
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var colors = ["#2869AA", "#FF2032", "#E17B38", "#979723", "#855898", "#E66368", "#C42A5D"];
    dayBar.html('');
    $('#modals').html('');
    dayBar.append('<div class="col-md-1 col-md-offset-1"></div>');
    var daily = result.daily.data;
    for(var i=1;i<8;i++){
        timestamp = daily[i].time * 1000;
        day = new Date(timestamp).getDay();
        month = new Date(timestamp).getMonth();
        date = new Date(timestamp).getDate();
        imageUrl = "./images/" + iconValue[daily[i].icon];
        minTemperature = Math.round(daily[i].temperatureMin)+ "&deg;";
        maxTemperature = Math.round(daily[i].temperatureMax)+ "&deg;";
        image = '<img class="img-responsive dailyBarIcon" src="'+imageUrl+'">';
        modalId = "modalDay"+i;
        condition = daily[i].summary;
        humidity = (daily[i].humidity != null) ? Math.round(daily[i].humidity*100)+"%" : "N.A";
        sunset = (daily[i].sunsetTime != null) ? moment.unix(daily[i].sunsetTime).tz(timezone).format("hh:mm A") : "N.A";
        sunrise = (daily[i].sunriseTime != null) ? moment.unix(daily[i].sunriseTime).tz(timezone).format("hh:mm A") : "N.A";
        if(unit == "si"){
            windSpeed = (daily[i].windSpeed != null) ?(daily[i].windSpeed).toFixed(2) + "m/s" : "N.A";
            dewPoint =  (daily[i].dewPoint != null) ? (daily[i].dewPoint).toFixed(2) + "&deg C" : "N.A";
            visibility = (daily[i].visibility != null) ? (daily[i].visibility).toFixed(2) + "km" : "N.A";
            pressure = (daily[i].pressure != null) ? (daily[i].pressure).toFixed(2) + "hPa" : "N.A";
        }else{
            windSpeed = (daily[i].windSpeed != null) ? (daily[i].windSpeed).toFixed(2) + "mph": "N.A";
            dewPoint = (daily[i].dewPoint != null) ? (daily[i].dewPoint).toFixed(2) + "&deg F" : "N.A";
            visibility = (daily[i].visibility != null) ? (daily[i].visibility).toFixed(2) +"mi" : "N.A";
            pressure = (daily[i].pressure != null) ? (daily[i].pressure).toFixed(2) + "mb" : "N.A";
        } 
        createModal(months[month], date, imageUrl, days[day], modalId, condition, humidity, windSpeed, visibility, pressure, sunset, sunrise);
        row = '<a data-toggle="modal" data-target="#'+modalId+'"><div class="col-md-1 dayBar" style="background-color:'+colors[i-1]+';">'+days[day]+ '<br><span style="line-height:2">'+months[month]+ ' ' + date+ '</span><br>'+ image +'<br> Min<br>Temp'+'<br><span class="bigTemp">'+minTemperature+'</span><br> Max<br>Temp<br><span class="bigTemp">'+maxTemperature+'</span></div></a>';
        dayBar.append(row);
    }

}

function createMap(result){
    $('#currentWeatherMap').html('');
    var map = new OpenLayers.Map("currentWeatherMap");
    var position       = new OpenLayers.LonLat(result.longitude,result.latitude).transform( fromProjection, toProjection);
    var layer_cloud = new OpenLayers.Layer.XYZ(
        "clouds",
        "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: 0.5,
            sphericalMercator: true
        }
    );

    var layer_precipitation = new OpenLayers.Layer.XYZ(
        "precipitation",
        "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: 0.5,
            sphericalMercator: true
        }
    );
    map.addLayers([new OpenLayers.Layer.OSM(),layer_precipitation,layer_cloud]);
    map.setCenter(position, zoom );
}

//populate Data; call back funtion that gets called after making successful ajax call to 
function successFunction(response){
    if(response != null)
        var result = JSON.parse(response);
    if(result != null){
        unit = $('#forecastForm input[type=radio]:checked').val();
        populateTimezones();
        timezone = result.timezone;
        generateRightNow(result);
        generateNext24(result);
        generateNext7(result);
        $('.result').show();
        createMap(result);
        
    }
}

