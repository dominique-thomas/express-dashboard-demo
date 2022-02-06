const express 	=	 require("express");
const router 	=    express.Router();

var id   = 4;
var data =    {					
					profiles : [
						{isAdmin: false, username: "mike@gmail.com", firstname: "Mike", lastname: "Sydney", id: 1, password: "aaa123"},
						{isAdmin: false, username: "cindy@gmail.com", firstname: "Cindy", lastname: "Johnson", id: 2, password: "aaa123"},
						{isAdmin: true, username: "joe@gmail.com", firstname: "Joe", lastname: "Kelley", id: 3, password: "aaa123"},
						{isAdmin: true, username: "dom@gmail.com", firstname: "Dominique", lastname: "Thomas", id: 4, password: "aaa123"}
					]
				 };
var userData = {
		id 		 : "",
		password : "",
		username : "",
		firstname: "",
		lastname: "",
		isAdmin	 : ""
};				 

var errorMsg = {
	msg: "404"
};

var adminDat = {};
var userDat = {};

router.get("/", function(req, res, next){
	res.redirect("/login");	
});

router.post("/login", function(req, res, next){
	
	var formData = req.body;
	var username = formData.username;
	var password = formData.password;
	
	if(!isValidLogin(username, password)){
		var dat = {
			error: "Username or Password doesn't match."
		}		
		
		res.render("login", dat);
		return;
	}
	else{		
		if(userData.isAdmin){
			res.redirect("/admin"); 
		}
		else{
			res.redirect("/user");
		}
	}
});

//Check for matching profile
function isValidLogin(username, password){
	
	const profiles = data.profiles; 
	var isValid	   = false;
	
	for(var i=0; i < profiles.length; i++){	
		if(username === profiles[i].username){
			if(password === profiles[i].password){									
				setUserData(i);				
				isValid = true;
				break;
			}
		}
	}
	
	return isValid;
}

//Update local user data
function setUserData(i){
	
	const profiles = data.profiles; 
	userData.password = profiles[i].password;
	userData.username = profiles[i].username;
	userData.firstname = profiles[i].firstname;
	userData.lastname = profiles[i].lastname;
	userData.id = profiles[i].id;
	userData.isAdmin = profiles[i].isAdmin;
}

//Reset local user data
function clearUserData(){
	
	userData.password = "";
	userData.username = "";
	userData.firstname = "";
	userData.id = "";
	userData.isAdmin = "";
	userData.lastname = "";
	
	userDat.updateUserSuccess = false;
	resetSuccessAdminDat();
}

router.get("/login", function(req, res, next){	
	clearUserData();
 	res.render("login", null );
});

router.get("/signout", function(req, res, next){
	clearUserData();
 	res.redirect("login");
});

router.get("/error", function(req, res, next){	
 	res.render("error", errorMsg );
});

router.get("/user", function(req, res, next){	

	if(userData.id == ""){
		res.redirect("login");
		return;
	}		
	
	userDat.userData = userData; //make deep copy	
 	res.render("user", userDat );	
	
	if(isUserFormSubmitted){
		userDat.updateUserSuccess = false;
		isCompleted = false;
	}
});

router.get("/admin", function(req, res, next){	
	
	if(userData.id == ""){
		res.redirect("login");
		return;
	}
	
	var tmpId = id+1;		
	adminDat.currentID = tmpId;
	adminDat.userData = userData; //make deep copy
	adminDat.profiles = data.profiles;//make deep copy

  	res.render("admin", adminDat );
	
	if(isAdminFormSubmitted){
		adminDat.addUserSuccess = false;
		adminDat.updateUserSuccess = false;
		adminDat.removeUserSuccess = false;
		isCompleted = false;
	}
});

router.post("/joinAdmin", function(req, res, next){
	
	id++;
	
	const formData = req.body;			
	resetSuccessAdminDat();

	
	if(formData.isAdmin === undefined){
		formData.isAdmin = false;
	}
	
	data.profiles.push(formData);	
	
	adminDat.addUserSuccess = true;	
	adminDat.activeUser = formData.username;	
	isAdminFormSubmitted = true;
	
	res.redirect(req.get('referer'));
});

router.post("/modifyAdmin", function(req, res, next){
	
	const username 	 = req.body.username;	
	const password   = req.body.password;	
	const firstname  = req.body.firstname;	
	const lastname 	 = req.body.lastname;	
	
	var tmpData  	 = JSON.parse(JSON.stringify(data.profiles));
	var fakePassword = "1234";
	 
	resetSuccessAdminDat();
	 
	for(var i = 0; i < tmpData.length; i++){	
	
		if(tmpData[i].username == username){		
		
			var passwordModified  = false;
			var firstnameModified = false;
			var lastnameModified  = false;
			var wasDataModified   = false;
					
			if(password != undefined && password != fakePassword){
				tmpData[i].password = password;
				passwordModified = true;
			}
			if(firstname != undefined){
				tmpData[i].firstname = firstname;
				firstnameModified = true;
			}
			if(lastname != undefined){
				tmpData[i].lastname = lastname;
				lastnameModified = true;
			}
		
			data.profiles[i] = tmpData[i];
			
			adminDat.updateUserSuccess = true;	
			adminDat.activeUser = username;				
			isAdminFormSubmitted = true;
			break;			
		}
	}
		
	res.redirect(req.get('referer'));
});

router.post("/modifyUser", function(req, res, next){
	
	const username 	 = req.body.username;	
	const password   = req.body.password;	
	const firstname  = req.body.firstname;	
	const lastname 	 = req.body.lastname;	
	
	var tmpData  	 = JSON.parse(JSON.stringify(data.profiles));
	var fakePassword = "1234";
	 
	for(var i = 0; i < tmpData.length; i++){	
	
		if(tmpData[i].username == username){		
		
			var passwordModified  = false;
			var firstnameModified = false;
			var lastnameModified  = false;
			var wasDataModified   = false;			
			
			if(password != undefined && password != fakePassword){
				tmpData[i].password = password;
				passwordModified = true;
			}
			if(firstname != undefined){
				tmpData[i].firstname = firstname;
				firstnameModified = true;
			}
			if(lastname != undefined){
				tmpData[i].lastname = lastname;
				lastnameModified = true;
			}			
			
			data.profiles[i] = tmpData[i];		
			userDat.updateUserSuccess = true;			
			setUserData(i);		
			isUserFormSubmitted = true;
			break;			
		}
	}
	i
	res.redirect(req.get('referer'));
	userDat.userData = userData;
});

router.post("/removeAdmin", function(req, res, next){
	
	const username 	= req.body.username;	
	
	var errorStr    = "The username '" + username + "' does not exist.";	
	var isUserAdmin	= false;
	var tmpData  	= JSON.parse(JSON.stringify(data.profiles));
 	
	resetSuccessAdminDat();
	
	for(var i = 0; i < tmpData.length; i++){	
		if(tmpData[i].username == username){				
 			tmpData.splice(i, 1);
			break;			
		}
	}
	
	adminDat.removeUserSuccess = true;
	adminDat.activeUser = username;		
	data.profiles = tmpData;
	isAdminFormSubmitted = true;
	
	res.redirect(req.get('referer'));
});


function resetSuccessAdminDat(){
	adminDat.addUserSuccess = false;
	adminDat.removeUserSuccess = false;
	adminDat.updateUserSuccess = false;
}

var isUserFormSubmitted = false;
var isAdminFormSubmitted = false;


module.exports = router;