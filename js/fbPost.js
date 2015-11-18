window.fbAsyncInit = function() {
    FB.init({
        appId      : '889535661129854',
        xfbml      : true,
        version    : 'v2.5'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


$('#fbIcon').click(function(){
    var city = $('#city').val().trim();
    var state = $('#state').val();
    var summary = $('#summary').html();
    var tempUnit = (unit=="si")?"C":"F";
    var icon = "http://weatherforecastapp.elasticbeanstalk.com/forecast/"+weatherImageUrl.substr(2);
    postToFacebook(icon, city, state,weatherCondition, temperature, tempUnit);
});

function postToFacebook(icon, city, state,summary, temperature, unit){
    FB.ui({
        method: 'feed',
        name: 'Current Weather in '+city+', '+state,
        link: 'http://forecast.io/',
        picture: icon,
        caption: 'WEATHER INFORMATION FROM FORECAST.IO',
        description: summary+', '+temperature+'&deg;'+unit,
        message: 'Facebook Dialogs are easy!',
        action_properties: JSON.stringify({
            object:'https://developers.facebook.com/docs/',
        })
    }, // callback
          function(response) {
        if (response && !response.error_message) {
            alert('Posted Successfully');
        } else {
            alert('Not posted');
        }
    });
}
