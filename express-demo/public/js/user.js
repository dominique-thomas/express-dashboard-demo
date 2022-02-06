"use strict";

$( document ).ready(function() {

	$("#modifyeErrorAlert").addClass("hidden");
	
	originalFirstName = $("#modifyFirstnameInput").val();
	originalLastName = $("#modifyLastNameInput").val();
	activeErrorDiv = $("#modifyErrorAlert");
});

$("#modifyUserFakeSubmitBtn").on("click", function(){

	var isValid = !(hasDataChanged());
	
	if(!isValid){		
		$("#modifyErrorAlert").html("Some data must be modified in order to submit changes.");
		showErrorMsg(activeErrorDiv);
	}
	else{
	   var obj = {passwordInput: $("#modifyPasswordInput"), firstnameInput: $("#modifyFirstnameInput"), 
				  lastnameInput: $("#modifyLastNameInput"), submitButton: $("#modifyUserSubmitBtn")};
	   validateFields(obj);
	}	
});

function removeInvalidClass(){
	$(".is-invalid").removeClass("is-invalid");
}

$(document).on("click", "button, input, a", function(event) { 
	hideAlert(); 
	removeInvalidClass();
 });
 
 function hideAlert(){
	 $("#modifyErrorAlert").addClass("hidden");
	 $("#successAlert").addClass("hidden");
 }