<?php

function getForecast($lat, $lng){
    $degree = $_GET['degree'];
    $forecastUrl = "https://api.forecast.io/forecast/3d546fbd350af4c7cdbcb8f5157571d1/$lat,$lng?units=$degree&exclude=flags";
    $result = file_get_contents($forecastUrl);
    $result = utf8_encode($result);
//    $result = json_decode($result);
//    displayForecast($result);
    return $result;
}

function getLatLng(){
    $streetAddress = $_GET['streetAddress'];
    $city = $_GET['city'];
    $state = $_GET['state'];
    $urlstreetAdd = urlencode($streetAddress);
    $urlCity = urlencode($city);
    $geoCodingLink = "https://maps.googleapis.com/maps/api/geocode/xml?address=".$urlstreetAdd. ",".$urlCity. ",". "$state";
    $geoCodeContent = simplexml_load_file($geoCodingLink);
    if($geoCodeContent->status == "OK"){
        $lat = $geoCodeContent->result->geometry->location->lat;
        $lng = $geoCodeContent->result->geometry->location->lng;
        $result = getForecast($lat, $lng);
        return $result;
    }else{
        return 101;//invalid address
    }
}


if(isset($_GET['submit'])){
    $result = getLatLng();
    if(!is_numeric($result)){
        echo $result;
    }else{
        //process error
    }
}

?>