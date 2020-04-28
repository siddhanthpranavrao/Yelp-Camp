const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// =============================
// COMMENTS ROUTE
// =============================

//NEW ROUTE
router.get("/new", middleware.checkLogin, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campgrounds: foundCampground
            });
        }
    });
});

//CREATE ROUTE
router.post("/", middleware.checkLogin, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {

            Comment.create(req.body.comment, (err, createdComment) => {
                if (err) {
                    console.log(err);
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    campground.comments.push(createdComment);
                    campground.save((err, campground) => {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash("success", "New Comment Added Successfully!");

                            res.redirect(`/campgrounds/${campground._id}`);
                        }
                    });
                }
            });
        }
    });
});

//EDIT COMMENTS ROUTE
router.get("/:commentId/edit", middleware.checkLogin, middleware.checkCommentOwnership, (req, res) => {

    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            return res.redirect("back");
        }
        Comment.findById(req.params.commentId, (err, comment) => {
            if (err) {
                return res.redirect("back");
            }

            res.render("./comments/edit", {
                comment: comment,
                campground: campground
            });
        })
    })

});

//UPDATE COMMENTS ROUTE
router.put("/:commentId", middleware.checkLogin, middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, comment) => {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
        req.flash("success", "Comment Updated Successfully");
        res.redirect(`/campgrounds/${req.params.id}`);

    });
});

//DELETE COMMENT ROUTE
router.delete("/:commentId", middleware.checkLogin, middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err) => {
        if (err) {
            console.log(err);
            return res.redirect(`/campgrounds/${req.params.id}`);
        }
        req.flash("error", "Comment Deleted Successfully");
        return res.redirect(`/campgrounds/${req.params.id}`);

    });
});






module.exports = router