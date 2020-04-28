const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");




//====================
//CAMPGROUND ROUTES
//====================


//INDEX ROUTE
router.get("/", (req, res) => {
    //Get all Campgrounds from db
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
        }
    });

});

//CREATE ROUTE
router.post("/", middleware.checkLogin, (req, res) => {
    //Get data from forma and add to campgrounds array

    req.body.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body, (err, campground) => {
        if (err) {
            console.log(err);
        } else {

            req.flash("success", "New Campground Added Successfully!");
            res.redirect("/campgrounds");
        }
    });
    //redirect to campgrounds page 
});

//NEW ROUTE
router.get("/new", middleware.checkLogin, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {

            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkLogin, middleware.checkCampgroudOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        res.render("campgrounds/edit", {
            campground: campground
        });

    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkLogin, middleware.checkCampgroudOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body, (err, campground) => {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
        req.flash("success", "Campground Updated Successfully");
        res.redirect(`/campgrounds/${campground._id}`);

    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkLogin, middleware.checkCampgroudOwnership, (req, res) => {
    //Deleting Comments of campground

    //Deleting Campground
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        req.flash("error", "Campground Deleted");
        res.redirect("/campgrounds");
    })
});



module.exports = router;