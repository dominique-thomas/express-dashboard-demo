const express 	 =	 require("express");
const path	     =    require('path');
const bodyParser = 	 require("body-parser");
const router	 = 	 require("./routes/routes");
const app 		 = 	 express();
const port		 = 	 5000;
var mustacheExpress = require('mustache-express');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }))


app.use(function(req, res, next){
	req.myTimestamp = new Date().toString();
	next(); //after executing, pass on to the next routes...
});

app.use("/", router);
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.listen(port);
console.log("Server running on http://localhost:" + port);