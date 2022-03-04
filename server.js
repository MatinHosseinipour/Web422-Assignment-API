/*********************************************************************************
 *
 * * WEB422 – Assignment 1
 * * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source
 * * (including web sites) or distributed to other students.
 * * Name: Matin Hosseini Pour Student ID: 151267192 Date: feb 24th, 2022
 * * Heroku Link: https://secret-tundra-37490.herokuapp.com/
 * * ********************************************************************************/

const express=require("express");
const url=require("url");
const bp = require('body-parser')
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB();

const cors=require("cors");
const app=express();

//middleWares
app.use(cors());
app.use(express.json());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


const HTTP_PORT=process.env.PORT||8080;

app.get("/",(req,res)=>{
    res.send("Web422 Assignment 1 Restaurant API");
})
//CREATED
app.post("/api/restaurants",(req,res)=>{
    let restaurant = db.addNewRestaurant(req.body)
    res.status(201).json({message:"Restaurant Added", restaurant:restaurant});
})
//INDEX(READ)
app.get("/api/restaurants",(req,res)=>{
    var q =url.parse(req.url,true).query;

    db.getAllRestaurants(q.page, q.perPage,q.borough)
        .then((restaurants) => {
            if(!restaurants) {
                console.log("No restaurant could be found");
            } else {
                res.json(restaurants);
            }
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
        });

})

//READ
app.get("/api/restaurants/:id",(req,res)=>{
    var id=req.params.id;
    db.getRestaurantById(id)
        .then((restaurant) => {
            if(!restaurant) {
                res.status(404).json({message:"No Restaurant Found"})
            } else {
                res.json(restaurant);
            }
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
            res.status(500).json({message:`There was an error: ${err}`})
        });
})

//UPDATE
app.put("/api/restaurants/:id",(req,res)=>{
    var id=req.params.id;
    var data=req.body;
    console.log('%c⧭', 'color: #aa00ff', data);

    db.updateRestaurantById(data,id)
        .then((r) => {
            console.log('%c⧭', 'color: #00a3cc', r);
            res.json({message:"restaurant  updated successfully"})
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
            res.status(500).json({message:`There was an error: ${err}`})
        });
});



//DELETE
app.delete("/api/restaurants/:id",(req,res)=>{
    var id=req.params.id;

    db.deleteRestaurantById(id)
        .then((r) => {
            res.json({message:"restaurant  deleted successfully"});
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
            res.status(500).json({message:`There was an error: ${err}`})
        });
});



db.initialize("mongodb+srv://dbMat:dbMat123@cluster0.lbfrd.mongodb.net/sample_restaurants?retryWrites=true&w=majority").then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

