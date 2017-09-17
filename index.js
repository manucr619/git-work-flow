var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: __dirname+ "/public/files/"});
var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));
var fs = require("fs");
var jsonfile = require('jsonfile')

    	var data = '';

var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1:27017/manu');Manusmiles@619
mongoose.connect('mongodb://manu:password@ds139844.mlab.com:39844/mambo');




var personSchema = mongoose.Schema({id: String,password: String});
var users = mongoose.model("users", personSchema);

var dataSchema = mongoose.Schema({name: String,age: String,number:Number,image:String,date:Date});
var detailsdata = mongoose.model("person", dataSchema);

app.set('view engine', 'pug');
app.set('views', './views');




app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(express.static('images'));

function checkSignIn(req, res,next){
    if(req.session.users){
       next();  //If session exists, proceed to page
    } else {
    	console.log("user"+req.session.users)
       var err = new Error("Not logged in!");
    res.redirect('/signup');
        console.log(err);  //Error, trying to access unauthorized page!
    }
}
app.get('/',checkSignIn,function(req, res){
	
	
   res.sendFile(__dirname+"/form.html");
});




app.get('/signup' ,function(req, res){
if(req.session.users){
        res.render('person');   //If session exists, proceed to page
    }else
    {
    res.render('signup');
  }
});

 app.get('/logout', function(req, res){
    req.session.destroy(function(){

        console.log("successfully logged out")
          res.redirect('/signup');

    });
});


app.post('/signup', function(req, res){
    if(!req.body.id || !req.body.password){
        res.status("400");
        res.send("Invalid details!");
    }
    else{
		users.find({"id":req.body.id,"password":req.body.password},function(err, response){
				data += response;
				if(data.length > 0){
            	var newUser = {id: req.body.id, password: req.body.password};
            	
				req.session.users = newUser.id;
              console.log((req.session.users));
             res.redirect('/');
	         }else{

        var newUser = {id: req.body.id, password: req.body.password};
        
		req.session.users = newUser.id;
              console.log((req.session.users));
		var newuser = new users({
         id: req.body.id,
         password: req.body.password  });
		      newuser.save(function(err, Users){
         if(err)
         res.send(err);
         else
         res.send("success/n login agian");
         });
        }
    });	
   	   			
				
  }
});      


app.post('/',function(req,res){
var personInfo = req.body; //Get the parsed information
   if(!personInfo.name || !personInfo.age || !personInfo.number ){
      res.render('show_message', {message: "Sorry, you provided worng info", type: "error"});
   } else {

      var newPerson = new detailsdata({
         name: personInfo.name,
         age: personInfo.age, 
         number : personInfo.number,
         date : personInfo.date,
     	});
         newPerson.save(function(err, detailsdata){
         if(err)
         res.render('show_message', {message: "Database error", type: "error"});
         else
            res.render('show_message', {message: "New person added", type: "success", person: personInfo});

      
     });
  }
  });

 

app.post('/uploadfile', upload.single('image'), function (req, res) 
       {
        
        var orginalname = req.file.orginalname;
      
        var filename = req.file.filename;

          var path = req.file.path;

          var destination = req.file.destination;
          var size = req.body.size;

        var personInfo = req.body; //Get the parsed information
        if(!personInfo.name || !personInfo.age || !personInfo.number ){
        res.render('show_message', {message: "Sorry, you provided worng info", type: "error"});
         } else {

          var newPerson = new detailsdata({
         name: personInfo.name,
         age: personInfo.age, 
         number : personInfo.number,
         image : path,
         date : personInfo.date
          });
         newPerson.save(function(err, detailsdata){
         if(err)
         res.render('show_message', {message: "Database error", type: "error"});
         else
            res.redirect("/");

      
     });
  }
      });



app.get("/api/session/",function(req,res){
    users.find({"id":req.session.users}, function(err, response){
    var json=JSON.stringify(response);
      var data = JSON.parse(json);
      res.json(data);  
});

});
	  
	  
	  
 app.get("/api",function(req,res){

 	detailsdata.find(
    function(err, response){
		var json=JSON.stringify(response);
     	var data = JSON.parse(json);
      res.json(data);
    }); 
}) ; 
 

app.get("/edit/:number",function(req,res){
  res.sendFile(__dirname+"/edit.html");

});



app.post("/edit/:number",function(req,res,err){
      res.sendFile(__dirname+"/personaldetails.htm");
 });
 

 app.get("/api/edit/:id",function(req,res){
  detailsdata.find({"_id":req.params.id} ,
    function(err, response){
    var json=JSON.stringify(response);
      var data = JSON.parse(json);
      res.json(data);
    }); 

});
 
 app.post("/api/editSubmit",upload.single('image'),function(req,res){
        console.log(req.file.path);
        var detailsdata = mongoose.model("person", dataSchema);
        var newPerson = new detailsdata({
         name: req.body.name,
         age: req.body.age, 
         number : req.body.number,
         date : req.body.date,
     });

      detailsdata.findByIdAndUpdate(req.body.id,{"name" : req.body.name ,"age" : req.body.age ,"number" : req.body.number ,"image" : req.file.path ,"date": req.body.date }, function(err, detailsdata){
          console.log(err);
         if(err)
         res.render('show_message', {message: "Database error", type: "error"});
         else
         res.redirect("/personaldetails");
      });


});

app.get("/delete/:number",function(req,res){
        detailsdata.findByIdAndRemove(req.params.number, function(err, detailsdata){
         if(err)
         res.render('show_message', {message: "Database error", type: "error"});
         else
         res.redirect("/personaldetails");
      });


});

 app.get("/personaldetails",function(req,res){
res.sendFile(__dirname+"/personaldetails.htm");

}) ; 
 





var server = app.listen(8521, function () {

   var host = server.address().address
   var port = server.address().port


   console.log("Server Address ::" +host);

   console.log("Example app listening at http://" +host);
})
