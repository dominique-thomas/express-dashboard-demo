"use strict";

var originalFirstName = "";
var originalLastName  = "";
const minPasswordSize = 4;
const minNameSize 	  = 2;
var fakePassword	  = "1234";
var activeErrorDiv	  = "";


$( document ).ready(function() {
	setCopyrightInfo();	
});

function logout(){
	 window.location.replace("/login");
}

(function () {
	
const forms = document.querySelectorAll('.requires-validation');

Array.from(forms)
  .forEach(function (form) {	  
  
    form.addEventListener('submit', function (event) {	
	
		if (!form.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		}
  
      form.classList.add('was-validated');
    }, false);
  });
})();

 $('form input').keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
  
 $('input[type="checkbox"]').click(function(){
	if($(this).prop("checked") == true){
		$(this).val(true);
	}
	else if($(this).prop("checked") == false){
		$(this).val(false);
	}
});

function setCopyrightInfo(){
	
	var str = "© 2022-";
	var date = new Date().getFullYear();

	str += date;
	$("#copyright").html(str);
}

function hasDataChanged(){
	
	var isSamePassword = false;
	var isSameFirstname = false;
	var isSameLastname = false;
	var isSame = true;
	
	var currentPasswordInput = $("#modifyPasswordInput").val();
	var currentFirstnameInput = $("#modifyFirstnameInput").val();
	var currentLastnameInput = $("#modifyLastNameInput").val();
		
	isSamePassword = (currentPasswordInput === fakePassword ? true: false);
	isSameFirstname = (currentFirstnameInput === originalFirstName ? true: false);
	isSameLastname = (currentLastnameInput === originalLastName ? true: false);
	
	var results = [isSamePassword, isSameFirstname, isSameLastname];
	isSame = results.every(function(val){
		return val;
	});

	return isSame;	
}

function showErrorMsg(message){
	 setTimeout(function(){
		message.removeClass("hidden");
	}, 10);
	
}
 
 function setLocalStorageItem(ref, val){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(ref, val);
	}
 }
 
 function removeLocalStorageItem(ref){
	 if (typeof(Storage) !== "undefined") {
		localStorage.removeItem(ref);
	}
 }
 
 function clearLocalStorage(){
	 if (typeof(Storage) !== "undefined") {
		localStorage.clear();
	}
 }

 
function validateFields(obj){
	
	const passwordInput = obj.passwordInput;
	const firstnameInput = obj.firstnameInput;
	const lastnameInput = obj.lastnameInput;
	const submitButton = obj.submitButton;
	
	const isValidSizePassword  = checkFieldSize({field: passwordInput, minSize: minPasswordSize});
	const isValidSizeName 	   = checkFieldSize({field: firstnameInput, minSize: minNameSize});	
	const isValidSizeName2 	   = checkFieldSize({field: lastnameInput, minSize: minNameSize});	
	const isNameANumber		   = checkIsANumber({field: firstnameInput});
	const isNameANumber2	   = checkIsANumber({field: lastnameInput});
	const isValidSpacePassword = checkHasSpaces({field: passwordInput });
	const isValidSpaceName	   = checkHasSpaces({field: firstnameInput});
	const isValidSpaceName2	   = checkHasSpaces({field: lastnameInput});
	
	const results = [isValidSizePassword, isValidSizeName, isValidSizeName2, isNameANumber, isNameANumber2, isValidSpacePassword, isValidSpaceName, isValidSpaceName2];
	
	const isValid = results.every(function (e) {
		return e;
	});
	
	if(isValid){
		submitButton.click();
	}	
}


function checkIsANumber(obj){
	
	const field   	  = obj.field;
	const fieldVal    = field.val();
	const isValid     = (isNaN(fieldVal));
	
	if(!isValid){			
		setTimeout(function(){
			field.addClass("is-invalid");	
		}, 10);		
	}
	
	return isValid;
}

function checkHasSpaces(obj){
	
	const field   	  = obj.field;
	const fieldVal    = field.val();
	const isValid 	  = (fieldVal.indexOf(" ") >= 0 ? false: true);  
	
	if(!isValid){	
		setTimeout(function(){
			field.addClass("is-invalid");	
		}, 10);
	}	
	return isValid;
}

function checkFieldSize(obj){
	
	const field   	  = obj.field;
	const minSize 	  = obj.minSize;
	const fieldVal    = field.val();
	var fieldValLen   = 0;
	var isValid		  = false;
	
	if(fieldVal !== undefined){		
		fieldValLen = fieldVal.length;
	}
	
	isValid = (fieldValLen >= minSize ? true : false);
	
	if(!isValid){	
		field.addClass("is-invalid");
	}
	
	return isValid;
}
