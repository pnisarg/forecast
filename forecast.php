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
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/forecast.css">
        <script src="./js/jquery-2.1.4.js"></script>
        <script src="./js/bootstrap.min.js"></script>
        <script src="./js/forecast.js"></script>
        <script src="./js/jquery.validate.js"></script>
        
    </head>
    <body>
        <div class="container">
            <div class="header">Forecast Search</div>
            <div class="row">
                <form id="forecastForm">
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
    </div> <!-- container end-->
</body>
</html>