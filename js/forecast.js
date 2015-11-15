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
    var city = $('#city').val().trim();
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
    if(unit == "si"){
        windSpeed = (result.currently.windSpeed * 3.6).toFixed(2) + " kph";
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
    //yet todo sunrise and sunset
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
        myTime = getHumanReadableTime(hourly[i].time);
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

//Generate content for Next 7 Days Tab 
function generateNext7(result){
    var dayBar = $('#weatherBarDiv');
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dayBar.html('');
    dayBar.append('<div class="col-md-1 col-md-offset-1"></div>');
    var daily = result.daily.data;
    for(var i=1;i<8;i++){
        var timestamp = daily[i].time * 1000;
        var day = new Date(timestamp).getDay();
        var month = new Date(timestamp).getMonth();
        var date = new Date(timestamp).getDate();
        var imageUrl = "./images/" + iconValue[daily[i].icon];
        var minTemperature = Math.round(daily[i].temperatureMin)+ "&deg;";
        var maxTemperature = Math.round(daily[i].temperatureMax)+ "&deg;";
        var image = '<img class="img-responsive dailyBarIcon" src="'+imageUrl+'">';
        var row = '<div class="col-md-1 dayBar">'+days[day]+ '<br><span style="line-height:2">'+months[month]+ ' ' + date+ '</span><br>'+ image +'<br> Min<br>Temp'+'<br><span class="bigTemp">'+minTemperature+'</span><br> Max<br>Temp<br><span class="bigTemp">'+maxTemperature+'</span></div>';
        dayBar.append(row);
    }
    
//     <div class="col-md-1 dayBar">something</div>
//                    <div class="col-md-1 dayBar">something</div>
//                    <div class="col-md-1 dayBar">something</div>
//                    <div class="col-md-1 dayBar">something</div>
//                    <div class="col-md-1 dayBar">something</div>
//                    <div class="col-md-1 dayBar">something</div>
//                    <div class="col-md-1 dayBar">something</div>
//
}

//populate Data; call back funtion that gets called after making successful ajax call to 
function successFunction(response){
    if(response != null)
        var result = JSON.parse(response);
    if(result != null){
        $('.result').show();
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



        //    map.zoomToMaxExtent();
        unit = $('#forecastForm input[type=radio]:checked').val();
        generateRightNow(result);
        generateNext24(result);
        generateNext7(result);
    }
}

