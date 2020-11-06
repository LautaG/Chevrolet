// var ENDPOINT = 'https://www.suzuki.com.mx/api/v1/';
var ENDPOINT = 'https://d2.netnet.mx/suzuki-api/v1/';

var IMAGES_BASE_URL= 'https://mercadolibre.com/org-img/mkt/MLM/2020/landings/200708_MLP_MLM_Suzuki_Ignis/images/ml-assets/';

var dealershipsData;

(function () {
  $.get(ENDPOINT + 'dealerships', function(result) {
    dealershipsData = result.items;
    var $states = $('#states');

    $.each(dealershipsData, function(i, val) {
      $states.append('<option value="'+val.name+'">'+val.name+'</option>');
    });

    $states.on('change', function() {
      loadDealerships($(this).val());
    });

    $('.checkbox-required').on('change', validateCheckbox);
  });
})();

function loadDealerships(state) {
  var stateObject = $.grep(dealershipsData, function(val) {
    return val.name === state;
  })[0];

  var items = state ? stateObject.items : [];
  var $dealerships = $('#dealerships');

  $dealerships.html('<option value="">Elige una opción</option>');

  $.each(items, function(i, val) {
    $dealerships.append('<option value="' + val.id + '">' + val.name + '</option>')
  });
}

var form = document.getElementById('form');

function validateRequired() {
	var result = true;

	$('.input-required').each(function () {
    var $self = $(this);
    var $errorDiv = $self.siblings('.ui-error__message');

    if($self.hasClass('select-required')) {
      $errorDiv = $self.parent().siblings('.ui-error__message');
    }

		if (!$self.val()) {
      $errorDiv.text($self.attr('data-error'));
      $errorDiv.show();
			result = false;
    } else if($self.hasClass('input-email') && !validateEmail($self.val())) {
      $errorDiv.text($self.attr('data-email'));
      $errorDiv.show();
			result = false;
    } else {
      $errorDiv.text('');
      $errorDiv.hide();
		}
  });

	return result;
}

function validateEmail(value) {
	var emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return emailPattern.test(value);
}

function validateCheckbox() {
  var $submitButton = $('#submitButton');
  if(validateCheckboxRequired()) {
    $submitButton.removeAttr('disabled');
    $submitButton.removeClass('ui-button--disabled');
  } else {
    $submitButton.attr('disabled', 'disabled');
    $submitButton.addClass('ui-button--disabled');
  }
}

function validateCheckboxRequired() {
  var result = true;

  $('.checkbox-required').each(function() {
    if(!$(this)[0].checked) {
      result = false;
    }
  });

  return result;
}

function formatTime(number) {
  return number < 10 ? '0' + number : number;
}

var submitHandler = function (event) {
	event.preventDefault();

	$('.input-required').on('change', validateRequired);

	if (validateRequired()) {
    var data = {};
    var today = new Date();
    var hours = formatTime(today.getHours());
    var minutes = formatTime(today.getMinutes());
    var seconds = formatTime(today.getSeconds());

    var time = hours + ":" + minutes + ":" + seconds;

    $('#initTime').val(time);

    var formData = $('#form').serializeArray();

    $(formData).each(function(index, obj){
        data[obj.name] = obj.value;
    });
    data = JSON.stringify(data, null, 2);

		$.ajax({
			url: ENDPOINT + 'wanted-cars',
			method: 'POST',
			data: data,
      contentType: 'application/json',
      success: function(result) {
      },
      error: function(error) {
        console.error(error);
      },
			complete: function () {
        alert('Exito');
        $('.fancybox-overlay').show();
  			$('#form').trigger("reset");
        $('.input-required').off('change', validateRequired);
			}
		});
	}
}

form.addEventListener("submit", submitHandler, true);
