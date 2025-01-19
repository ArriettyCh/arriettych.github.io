/* --------------------------------------------------
  * Custom Js 
  * --------------------------------------------------*/
 (function($) {
    'use strict';
    $("#sub-form").submit(function (e) {

		e.preventDefault(); // avoid to execute the actual submit of the form.

        var formData = {
            name:$("#name").val(),
            email:$("#email").val(),
            phone:$("#phone").val(),
            message:$("#message").val()
            }; 
		if ($("#email").val()) {
			$.ajax({
				'url': 'sendmail.php',
				'method': 'POST',
				'dataType': 'json',
				'contentType': 'application/json',
				'data': JSON.stringify(formData),
				'success': function (payload) {
                    if(payload.code=="200"){
                    $(".alert").removeClass("d-none").html("<p>Thanks for contacting us.. we will get back to you soon.</p>").addClass("alert-warning");
                    $("#sub-form").trigger("reset");
                    }else{
                    $(".alert").removeClass("d-none").html("<p>Please enter required fields. (or) Try again..</p>").addClass("alert-warning");
                    }
				}
			});
		} else {
            $(".alert").removeClass("d-none").html("<p>Please enter required fields. (or) Try again..</p>").addClass("alert-warning");
		}
	});

})(jQuery);