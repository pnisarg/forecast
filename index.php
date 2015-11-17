<!--
Author: Nisarg Patel
Date: 11/08/2015
Home Work Assignment 8 CSCI 571
-->
<?php
$usStatesList=array(""=>"Select your state... ","AL"=>"Alabama","AK"=>"Alaska","AZ"=>"Arizona","AR"=>"Arkansas","CA"=>"California","CO"=>"Colorado","CT"=>"Connecticut","DE"=>"Delaware","FL"=>"Florida","GA"=>"Georgia","HI"=>"Hawaii","ID"=>"Idaho","IL"=>"Illinois","IN"=>"Indiana","IA"=>"Iowa","KS"=>"Kansas","KY"=>"Kentucky","LA"=>"Louisiana","ME"=>"Maine","MD"=>"Maryland","MA"=>"Massachusetts","MI"=>"Michigan","MN"=>"Minnesota","MS"=>"Mississippi","MO"=>"Missouri","MT"=>"Montana","NE"=>"Nebraska","NV"=>"Nevada","NH"=>"NewHampshire","NJ"=>"NewJersey","NM"=>"NewMexico","NY"=>"NewYork","NC"=>"NorthCarolina","ND"=>"NorthDakota","OH"=>"Ohio","OK"=>"Oklahoma","OR"=>"Oregon","PA"=>"Pennsylvania","RI"=>"RhodeIsland","SC"=>"SouthCarolina","SD"=>"SouthDakota","TN"=>"Tennessee","TX"=>"Texas","UT"=>"Utah","VT"=>"Vermont","VA"=>"Virginia","WA"=>"Washington","WV"=>"WestVirginia","WI"=>"Wisconsin","WY"=>"Wyoming");

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Forecast</title>
        <script src="http://openlayers.org/api/OpenLayers.js"></script>
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/forecast.css">
        <script src="./js/jquery-2.1.4.js"></script>
        <script src="./js/bootstrap.min.js"></script>
        <script src="./js/timezones.js"></script>
        <script src="./js/forecast.js"></script>
        <script src="./js/jquery.validate.js"></script>
        <script src="./js/moment.js"></script>
         <script src="./js/moment-tz.js"></script>
        

    </head>
    <body>
        <div class="container">
            <div class="header">Forecast Search</div>
            <div class="row">
                <form id="forecastForm" method="GET" action="./forecast.php/getForecast">
                    <fieldset>
                        <div class="col-md-3 form-group nopadding">
                            <label class="control-label" for="streetAddress">Street Address:<span class="star">*</span></label>
                            <input type="text" class="form-control"  name="streetAddress" id="streetAddress"  placeholder="Enter Street Address">
                        </div>
                        <div class="col-md-2 form-group nopadding">
                            <label class="control-label" for="city">City:<span class="star">*</span></label>
                            <input type="text" class="form-control" name="city" id="city" placeholder="Enter the city name">
                        </div>
                        <div class="col-md-2 form-group">
                            <label class="control-label" for="state">State:<span class="star">*</span></label>
                            <select class="form-control" name="state" id="state">
                                <?php
                                foreach($usStatesList as $key => $value ){
                                    echo "<option value='$key' >$value</option>";
                                }
                                ?>
                            </select>
                        </div>
                        <div class="col-md-5">
                            <div class="col-md-6 form-group" style="padding: 0px;">
                                <label class="control-label" for="Degree">Degree:<span class="star">*</span></label><br>
                                <input type="radio" class="form-group" name="degree" value="us" checked> Fahrenheit </input><span> &nbsp;</span>
                            <input type="radio" class="form-group" name="degree" value="si"> Celsius  </input>
                        </div>

                    <div class="col-md-6 form-group mainFormButtons" align="right" style="padding: 0px;"><br>
                        <button type="submit" name="submit" id="submitButton" class="btn btn-primary">
                            <span class="glyphicon glyphicon-search" aria-hidden="true"></span> Submit
                        </button>
                        <button type="button" class="btn btn-default" id="clearButton">
                            <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Clear
                        </button>
                    </div>
                    <div class="form-group form-inline" align="right">
                        Powered by:
                        <a href="http://forecast.io" alt="Forecast.io">
                            <img src="./images/forecast_logo.png" class="form-group" alt="Forecast" height="50px" width="120px">
                        </a>
                    </div>
                    </div>

                </fieldset>
            </form>
        </div> <!-- row end-->
    <hr>
    <div class="result">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#rightNow" aria-controls="home" role="tab" data-toggle="tab">Right Now</a></li>
            <li role="presentation"><a href="#next24Hours" aria-controls="profile" role="tab" data-toggle="tab">Next 24 hours</a></li>
            <li role="presentation"><a href="#next7days" aria-controls="messages" role="tab" data-toggle="tab">Next 7 Days</a></li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="rightNow">
                <div class="row">
                    <div class="col-sm-12 col-md-6" id="currentWeatherTable">
                        <div class="col-md-6 currentWeatherTableHeader" id="weatherImage"></div>
                        <div class="col-md-6 currentWeatherTableHeader" style="position:relative;">
                            <ul class="temperatureDiv">
                                <li id="summary">something something</li>
                                <li >
                                    <span id="temperature">324</span>
                                    <span id="unit"> F&deg;</span>
                                </li>
                                <li>
                                    <span id="lowTemp">23</span> 
                                    <span style="color:black"> | </span>
                                    <span id="highTemp">43</span>
                                </li>
                            </ul>
                            <img src="./images/fb_icon.png" id="fbIcon" class="img-responsive">
                       </div>

                        <table class="table table-striped table-responsive">
                            <tr><td>Precipitation</td><td id="precipitation">None</td></tr>
                            <tr class="danger"><td>Chance of Rain</td><td id="rainChance">None</td></tr>
                            <tr><td>Wind Speed</td><td id="windSpeed">None</td></tr>
                            <tr class="danger"><td>Dew Point</td><td id="dewPoint">None</td></tr>
                            <tr><td>Humidity</td><td id="humidity">None</td></tr>
                            <tr class="danger"><td>Visibility</td><td id="visibility">None</td></tr>
                            <tr><td>Sunrise</td><td id="sunrise">None</td></tr>
                            <tr class="danger"><td>Sunset</td><td id="sunset">None</td></tr>
                        </table>
                    </div>
                    <div class="col-sm-12 col-md-6" id="currentWeatherMapOuter"><div id="currentWeatherMap"></div></div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="next24Hours">
                <table class="table table-responsive" id="next24HoursTable">
                    <tr class="blueHeader">
                        <th>Time</th>
                        <th>Summary</th>
                        <th>Cloud Cover</th>
                        <th>Temp (&deg;F)</th>
                        <th>View Details</th>
                    </tr>
                </table>
            </div>
            <div role="tabpanel" class="tab-pane" id="next7days">
                <div class="container-fluid">
                <div class="row" id="weatherBarDiv">
                </div>
                </div>
            </div>
        </div>
    </div><!-- End of class result -->
    </div> <!-- container end-->
    <div id="modals">

</div>
</body>
</html>