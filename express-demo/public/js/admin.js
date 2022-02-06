"use strict";

var usernameArr 	  = [];
var isAdminArr 		  = [];
var adminUsername     = "dom@gmail.com";		 
var removeUserActive  = false;
var modifyUserActive  = false;
var activeInput		  = "";
var activeSubmitBtn   = "";


$( document ).ready(function() {
	
	$("#addUserModal, #removeUserModal, #modifyUserModal").modal({backdrop: "static", keyboard: false});
	getDivData();	
	
	$("#newUserErrorAlert").addClass("hidden");
	$("#removeErrorAlert").addClass("hidden");
	$("#modifyeErrorAlert").addClass("hidden");
	
	clearFormData();	
	
	autocomplete(document.getElementById("removeSearchInput"), usernameArr);
	autocomplete(document.getElementById("modifySearchInput"), usernameArr);	
});

function getDivData(){
	
	var str = $("#dataDiv").html();		
	var str2 = $("#dataDiv2").html();	
	var str3 = $("#dataDiv3").html();	
	
	if(str == null || str2 == null){
		return;
	}
	
	usernameArr = str.split(",");
	usernameArr.pop();
	
	isAdminArr = str2.split(",");
	isAdminArr.pop();
	
	adminUsername = str3;
	
	$("#dataDiv").html("");
	$("#dataDiv2").html("");
	$("#dataDiv3").html("");
}

function hideAlert(){	

	$("#newUserErrorAlert").addClass("hidden");
	$("#removeErrorAlert").addClass("hidden");
	$("#modifyErrorAlert").addClass("hidden");
	$("#successAlert").addClass("hidden");
}

$("#addUserFakeSubmitBtn").on("click", function() {
   
   var username = $("#emailInput").val();	
   
   if(isAlreadyRegistered(username)){
	   showErrorMsg($("#newUserErrorAlert"));
   }
   else{
	   var obj = {passwordInput: $("#passwordInput"), firstnameInput: $("#firstNameInput"), 
				  lastnameInput: $("#lastNameInput"), submitButton: $("#addUserSubmitBtn")};
	   validateFields(obj);
   }  
});

function isAlreadyRegistered(username){
	
	var isRegistered = false;
	for(var i=0; i < usernameArr.length; i++){		
		if(username === usernameArr[i]){
			isRegistered = true;
			break;			
		}
	}
	
	return isRegistered;
}

function removeInvalidClass(){
	$(".is-invalid").removeClass("is-invalid");
}

$(document).on("click", "button, input, a", function(event) { 
	hideAlert(); 
	removeInvalidClass();
 });
 
 $("#searchTableInput").on("keyup", function() {	 
 	 var value = $(this).val().toLowerCase();
    $("#userTableBody tr").filter(function() {
     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

$("#removeUserButton").on("click", function(){
	resetActiveButtons();
	removeUserActive = true;
	setActiveBtnDefaults();
});

$("#modifyUserButton").on("click", function(){
	
	resetActiveButtons();
	modifyUserActive = true;
	setActiveBtnDefaults();	
	
	$("#modifyUserDescription").removeClass("hidden");
	$("#modifyUserFakeSubmitBtn").addClass("disabled");
	$("#modifyUserNextBtn").removeClass("disabled");
	$("#modifySearchInput").removeAttr("readonly");
	$("#modifySearchInput").removeClass("readonly");
	$("#modifySearchInputLabel").html("Email");
	
	$("#modifyUserForm").addClass("hidden");	
});

$(".btn-close").on("click", function(){
	resetActiveButtons();
});

function resetActiveButtons(){
	removeUserActive = false;
	modifyUserActive = false;
	clearFormData();
}

function setActiveBtnDefaults(){

	activeInput = $("#modifySearchInput");
	activeErrorDiv = $("#modifyErrorAlert");
	activeSubmitBtn = $("#modifyUserSubmitBtn");
	
	if(removeUserActive){
		activeInput = $("#removeSearchInput");
		activeErrorDiv = $("#removeErrorAlert");
		activeSubmitBtn = $("#removeUserSubmitBtn");
	}
}
 
$("#removeSearchInput, #modifySearchInput").on("input", function() {
 	 var value 	 = $(this).val();		 
	 activeInput.val(value);
}); 
  
 function isValidUserPermission(activeUsername){
	
	var username = activeUsername;	
	var isUserAdmin = false;
	
	for(var i=0; i < usernameArr.length; i++){			
		if(username === usernameArr[i]){		
			isUserAdmin = isAdminArr[i];
			isUserAdmin = (isUserAdmin === "true");	
			break;
		}
	}	 
	
	if(isUserAdmin){
		return false;
	}
	
	return true;	
 }
 
 function isOwnProfile(activeUsername){
	var isProfile = (adminUsername === activeUsername ? true : false);
	return isProfile;	
 }
 
$("#removeUserFakeSubmitBtn, #modifyUserNextBtn").on("click", function(){
	
	var activeUsername = activeInput.val();	
	var isValidUser    = true;
	var isExistingUser = isAlreadyRegistered(activeUsername);
	
	if(modifyUserActive && isOwnProfile(activeUsername)){
		isValidUser = true;
	}
	else{
		isValidUser = isValidUserPermission(activeUsername);
	}

	const results = [isValidUser, isExistingUser];
	var errorStr = "";
	
	const isValid = results.every(function (e) {
		return e;
	});	
	
	if(!isValid){		
	
		var verb = "modify";	
		
		if(removeUserActive){
			verb = "remove";
		}
		
		if(!isValidUser){
			errorStr = "Cannot " + verb + " Admin profile. Please contact your System Admin for further assistance.";
		}
		if(!isExistingUser){
			errorStr = "Cannot " + verb + " a user that is not registered.";
		}
		
		activeErrorDiv.html(errorStr);		
		showErrorMsg(activeErrorDiv);
		
	}
	else{
		if(removeUserActive){
			var inputVal = activeUsername;
			$("#removeEmailInput").val(inputVal);
   		    $("#removeUserSubmitBtn").click();
		}
		
		showModifyForm();
	}
});

function showModifyForm(){
	
	$("#modifyUserDescription").addClass("hidden");
	$("#modifyUserForm").removeClass("hidden");
	$("#modifyUserFakeSubmitBtn").removeClass("disabled");
	$("#modifyUserNextBtn").addClass("disabled");
	$("#modifySearchInput").attr("readonly", "true");
	$("#modifySearchInput").addClass("readonly");
	$("#modifySearchInputLabel").html("Email (readonly)");
	
	var inputVal = $("#modifySearchInput").val();	
	$("#modifyEmailInput").val(inputVal);
	
	populateModifyUserForm();
}

function populateModifyUserForm(){
	
	var firstname = "";
	var lastname = "";
	var inputVal = $("#modifySearchInput").val();	
	
	var formData = $( "#userTableBody tr:contains(" + inputVal + ")" ).each(function(){
        var this_row = $(this);
        originalFirstName =  firstname = $.trim(this_row.find('td:eq(4)').html());
		originalLastName  =  lastname = $.trim(this_row.find('td:eq(5)').html());
	});
	
	$("#modifyPasswordInput").val(fakePassword);
	$("#modifyFirstnameInput").val(firstname);
	$("#modifyLastNameInput").val(lastname);
}


function clearFormData(){
	$('#newUserForm:input, #modifyUserForm:input, #removeUserForm:input, #removeSearchInput:input, #modifySearchInput:input').val('');
}


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

