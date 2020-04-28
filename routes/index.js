const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware");



//ROOT ROUTE
router.get("/", (req, res) => {
    res.render("landing");
});



//=================================
//AUTH ROUTES
//=================================

//REGISTER ROUTE
router.get("/register", middleware.checkLoginPage, (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    User.create(req.body, (err, user) => {
        if (err) {
            req.flash("error", "Username alredy exists!");
            return res.redirect("/register");
        }

        if (!user) {
            return res.redirect("/register");
        }

        req.flash("success", "Welcome " + req.body.username);
        req.session.userId = user._id;
        res.redirect("/campgrounds");
    })
});

//LOGIN ROUTE
router.get("/login", middleware.checkLoginPage, (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            req.flash("error", "Incorrect Username or Password");
            return res.render("login", {
                error: "Incorrect Username or Password"
            });
        }
        req.flash("success", "Welcome back " + req.body.username);
        req.session.userId = user._id;
        res.redirect("/campgrounds");
    });
});

//LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.session.userId = undefined;
    req.user = undefined;
    res.locals.user = undefined;

    req.flash("success", "Logout Successfull!");
    res.redirect("/campgrounds");
});

module.exports = router;