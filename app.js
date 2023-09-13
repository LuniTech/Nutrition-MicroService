const express = require("express")
require("dotenv").config();
const mongoose = require("mongoose");

let bodyParser = require("body-parser")
let uri = process.env.MONGO_URI;
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true})

console.log("Successfully connected to database!")
let app = express();
const cors = require("cors");

// I have made the request with and without app.options
app.options("*", cors())

// allowedDomains = [Array of allowed sites] 
// My website is listed in the array as "https://..."
app.use(cors());
//create schema
let NSchema = new mongoose.Schema({
Name: {type:String,required:true},
Energy:Number,
Protein:Number,
Carbohydrates:Number,
TFat:Number,
SFat:Number,
MFat:Number,
PFat:Number,
Fibre:Number,
Sodium:Number,
ImageUrl:String
});

//Create Model
let nutriModel = mongoose.model('nutriData',NSchema)
console.log("All good here!");
let port = process.env.PORT||3000;
app.listen(port);
console.log("Now listening to port 3000...")
app.use("/css",express.static(__dirname+ '/bootstrap-4.5.2/bootstrap-4.5.2/dist/css'))
app.use("/pics",express.static(__dirname+ '/pics'))

app.get("/",(req,res)=>{
res.sendFile(__dirname+'/index.html')
})
app.get("/addRecord",(req,res)=>{
res.sendFile(__dirname+'/addPage.html')
})

app.post("/search",bodyParser.urlencoded({extended:false}),(req,res)=>{
	let isFound=false;
	let newDoc = new nutriModel({
	
	Name: req.body.Name,
Energy:parseFloat(req.body.Energy),
Protein:parseFloat(req.body.Protein),
Carbohydrates:parseFloat(req.body.Carbohydrates),
TFatv:parseFloat(req.body.TFat),
SFat:parseFloat(req.body.SFat),
MFat:parseFloat(req.body.MFat),
PFat:parseFloat(req.body.PFat),
Fibre:parseFloat(req.body.Fibre),
Sodium:parseFloat(req.body.Sodium),
ImageUrl: req.body.imageUrl
	
	})
	
	nutriModel.findOne({Name:newDoc.Name},{Name: req.body.Name,
Energy:parseFloat(req.body.Energy),
Protein:parseFloat(req.body.Protein),
Carbohydrates:parseFloat(req.body.Carbohydrates),
TFatv:parseFloat(req.body.TFat),
SFat:parseFloat(req.body.SFat),
MFat:parseFloat(req.body.MFat),
PFat:parseFloat(req.body.PFat),
Fibre:parseFloat(req.body.Fibre),
Sodium:parseFloat(req.body.Sodium),
ImageUrl: req.body.imageUrl},(error,data)=>{
		if(error)
			console.log("Error")
		else{
			isFound=true;
			res.end()
			return
			}
			
			console.log("Isfound == ",isFound)
			if(!isFound)
			{
		newDoc.save((err,data)=>{
			if(err) console.log(err)
				else{
					res.send("Save successful!")
					console.log("Save successful!")
					res.sendFile(__dirname+"/CRUDsuccess.html")
					res.end()
			return
				}
			
		})	
			}
			else{
				console.log("Document Already Existss!")
			}
			
			
			})
			
			
	
})

app.get("/api/allRecords",(req,res)=>{
	nutriModel.find({},(err,data)=>{
		if(err) console.log(err)
			else{
				res.send(data)
			}
	})
	
	
})
app.get("/deletePage",(req,res)=>{
	res.sendFile(__dirname+"/deletePage.html")
	
})

app.post("/del",bodyParser.urlencoded({extended:false}),(req,res)=>{
	let trimmedId = req.body.RId.trim();
			nutriModel.findByIdAndRemove(trimmedId,(err,data)=>{
			if(err) 
			{
res.send("ERROR, Record not found!")				
			console.log(err)
			}			
			else{
					res.sendFile(__dirname+"/CRUDsuccess.html")
					//res.send("Record Deleted Successfully!")
					console.log("Deletion successful");
					res.end();
				}
			
		})
	})
