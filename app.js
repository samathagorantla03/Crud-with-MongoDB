var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var objectID = mongodb.ObjectId;
var bodyParser=require('body-parser');
var pug = require('pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','pug');
var connection = new MongoClient("mongodb://127.0.0.1:27017");

app.get("/unicornsHome",(req,res)=>{
    connection.connect(function(err,con){
        if(err){console.log('connection error',err)}
        else{
            var db = con.db('intern');
            db.collection('unicorns').find().toArray(function(err,data){
                if(err){console.log('data error',err)}
                res.render("unicornsTable",{unicorns:data});
                con.close();
            })
        }
    })
})

app.get("/add",(req,res)=>{
    res.render("add")
})

app.post("/add",(req,res)=>{
    connection.connect(function(err,con){
        if(err){console.log('connection error',err)}
        else{
            var db = con.db('intern');
            const date = new Date(req.body.dob);
            var a=req.body.loves;
            var t=a.split(",");
            var temp={name:req.body.name,dob:date,loves:t,weight:req.body.weight,gender:req.body.gender,vampires:req.body.vampires}
            db.collection('unicorns').insertOne(temp,function(err,data){
                if(err){console.log('data error',err)}
                console.log("item inserted")
                res.redirect("/unicornsHome")
                con.close();
            })
        }
    })
})

app.get("/delete/:id",(req,res1)=>{
    var id = req.params.id;
    console.log(objectID(id))
    connection.connect(function(err,con){
        if(err){console.log('connection error',err)}
        else{
            var db = con.db('intern');
            db.collection('unicorns').deleteOne({"_id":objectID(id)},function(err,res){
                if(err){console.log("Deletion Error::",err)}
                else{
                    console.log('item deleted');
                    res1.redirect("/unicornsHome");
                    con.close();
                }

            })
        }
    })    
})

app.get("/edit/:key",function(req,res)
{
    connection.connect(function(err,con)
    {
        if(err){console.log("Connection err::",err)}
        else{
            var db=con.db('intern');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err){console.log("err::",err);}
                else{
                    res.render("edit",{unicorns:data,index:req.params.key})
                    con.close();
                }
            })
        }
    })
})


app.post("/update/:key",function(req,res)
{
   connection.connect(function(err,con)
    {
        if(err){console.log("Connection err::",err)}
        else{
            var db=con.db('intern');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err){console.log("err::",err);}
                else{
                    var ind=req.params.key;
                    //var temp={name:data[ind].name};
                    var temp = {"_id":objectID(data[ind]._id)};
                    var a=req.body.loves;
                    var t=a.split(",");
                    var newdetails={$set:{name:req.body.name,dob:req.body.dob,loves:t,weight:req.body.weight,gender:req.body.gender,vampires:req.body.vampires}};
                    db.collection('unicorns').updateOne(temp,newdetails,function(err,data)
                    {
                        if(err){console.log("update error::",err);}
                        else{
                            res.redirect("/unicornsHome");
                            con.close();
                        }
                    })
                }
            })
        }
    })
})
app.listen(3400,()=>{console.log("server running on 3400")})