$('document').ready(function(){

//        $('.result').hide();

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
    
}
//Generate content for rightNow Tab 
function generateRightNow(result){
    setImage(result.currently.icon);
    setTemperature(result);
}
//Generate content for Next 24 Hours Tab 
function generateNext24(result){
    
}
//Generate content for Next 7 Days Tab 
function generateNext7(result){
    
}
//populate Data
function successFunction(response){
    var result = JSON.parse(response);
    if(result != null){
        $('.result').show();
        generateRightNow(result);
        generateNext24(result);
        generateNext7(result);
    }
}

