$('document').ready(function(){
    
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
          console.log("submit " + form);
      }
  });
    
    //clear form
    $('#clearButton').click(function(){
        var form = $('#forecastForm');
        form.validate().resetForm();
        form[0].reset();
    });
});

