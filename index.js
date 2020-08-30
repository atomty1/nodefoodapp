const express = require("express");
const app= express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const por = process.env.PORT || 5000;
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://atomty:tayelolu@food.juzeb.mongodb.net/assignment?retryWrites=true&w=majority";

let allFoods;
let user;
let hr;
const cluster = require("cluster");
if (cluster.isMaster) {
    const os = require("os");
    const oscpus = os.cpus();
    for(let i = 0; i< oscpus.length; i++){
        cluster.fork();
    }
   
    cluster.on("exit", worker=>{
        cluster.fork();
    })
    
} else{
        //  mongoClient.connect(uri, (err, client)=>{
        //     if(err) throw err;
        //     console.log(client);
        //    const db = client.db("foodvendor");
        //    db.createCollection("customers", (err, res)=>{
        //        if(err) throw err;
        //        console.log(res);
        //    })
        // })
        // mongoClient.connect(uri, (err, client)=>{
        //     if(err) throw err;
        //     console.log(client);
        //    const db = client.db("foodvendor");

        //    db.createCollection("customers", (err, res)=>{
        //        if(err) throw err;
        //        console.log(res);
        //    })
        // })

    app.get("/", (req, res)=>{
   
        
        res.render("index");
    })
    app.get("/login", (req, res)=>{
   
        
        res.render("login");
    })
    app.get("/editFood/:email",(req, resp)=>{
        console.log(allFoods);
        let {email} = req.params;
        // console.log(num);
        mongoClient.connect(uri, (err, client)=>{
            const db = client.db("foodvendor");
  
            db.collection("customers").findOne({email}, (err, res)=>{
                let {status} = res;
               
                db.collection("customers").updateOne({email}, { $set: { status: status+1 } });
                // db.collection("allFoods").findOne({email}, (err, res)=>{
                //     let {status} = res;
                //     console.log(res);
                //     db.collection("allFoods").updateOne({num}, { $set: { status: status+1 } })
                console.log(allFoods);
                 
                    resp.render("canteen",{ allFoods, user, hr, message: "updated successfully"});
                // })
             
                // resp.render("canteen",{ allFoods, user, hr, message: "updated successfully"});
            })
        })
       
    }) 
    app.post("/loginSuccess", (req, resp)=>{
        // console.log(req);
        mongoClient.connect(uri, (err, client)=>{
            const db = client.db("foodvendor");
            let {email, password}= req.body;
           
            db.collection("customers").findOne({email, password}, (err, res)=>{
             if(res){
                db.collection("allFoods").find({}).toArray((err, response)=>{
                   let date = new Date();
                   let hr = date.getHours();
                //    console.log(date.getHours());
                allFoods = response;
                user = res;
                hr= hr;
                console.log(allFoods);
                    resp.render("canteen",{ allFoods, user, hr})
                })
                
                // db.collection("allFoods").find({},(err, response)=>{
                //     console.log(response);
                //     // resp.render("canteen",response);
                // })
                
             } else{
                resp.render("login", {message: "please login"});
             }
            })
        })
        
       
    })
    app.get("/addFood", (req, resp)=>{
            resp.render("eatery");
    })

    app.post("/regFood", (req, resp)=>{
       mongoClient.connect(uri, (err, client)=>{  
            const db = client.db("foodvendor");           
        db.collection("allFoods").findOne({name: req.body.name}, (err, res)=>{
            // console.log(res);
            if (res) {
                resp.render("eatery", {message: "food already exists"})

                
            } else {
                let {body} = req;
                
                let num = Math.floor(Math.random()* 1000);
                num= num.toString();
                let info = {...body, status: 0, num};
                // console.log("no")
                try {

                    // db.collection("customers").delete({}, (err, res)=>{
                    db.collection("allFoods").insertOne(info, (err, res)=>{
                      if(res){
                        resp.render("eatery", {message: "Food added successfully"});
                      }
                    })
                    // db.customers.insert(req.body)
                } catch (error) {
                    // console.log(error)
                }
                // console.log(message);
               
            }
        });
                // if(res){
                //     resp.render("eatery");
                // } else{
                //     resp.render("login", {message: "user not found"});
                // }
            // })
        })
    })

    app.post("/addUser", (req, resp)=>{
        mongoClient.connect(uri, (err, client)=>{
            const db = client.db("foodvendor");
            let message;
            let {body} = req;
            let info = {...body, status: 0};
            db.collection("customers").findOne({email: body.email}, (err, res)=>{
                if (res) {
                    resp.render("index", {message: "email already exists"})

                    
                } else {
                    try {

                        // db.collection("customers").delete({}, (err, res)=>{
                        db.collection("customers").insertOne(info, (err, res)=>{
                            if(err){
                                message= "An error occured"
                                // console.log("an error");
                            } else {
                                message = "submitted successfully";
                                
                                // console.log("submitted successfully");
                            }
                            // resp.render("index", {message: "submitted successfully"})
                        })
                        // db.customers.insert(req.body)
                    } catch (error) {
                        // console.log(error)
                    }
                    resp.render("index", {message: "submitted successfully"})
                }
            });
 
            
            // let newCustomer = {};
            // db.insertOne(req.body).then(resp=>console.log(resp))
        })
        // console.log(req.body);
       
    })
    app.listen(por, (req, res)=>{
    })
}




