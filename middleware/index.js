const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");

const middlewarObj = {};

middlewarObj.checkCampgroudOwnership = (req, res, next) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            return res.redirect("back");
        }
        if (campground.author.id.equals(req.user._id)) {
            return next();
        }
        req.flash("error", "You don't have permission to do that");
        res.redirect(`/campgrounds/${campground._id}`);
    });
}

middlewarObj.checkCommentOwnership = (req, res, next) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        if (comment.author.id.equals(req.user._id)) {
            return next();
        }
        req.flash("error", "You don't have permission to do that");
        res.redirect(`/campgrounds/${req.params.id}`);
    });
}


//CHECK LOGIN FUNCTION
middlewarObj.checkLogin = (req, res, next) => {
    if (!(req.user)) {
        req.flash("error", "You need to be Logged in to do that");
        return res.redirect("/login");
    }

    next();
}

middlewarObj.checkLoginPage = (req, res, next) => {
    if (!(req.user)) {
        return next();
    }
    req.flash("error", "You are already Logged in!");
    res.redirect("/campgrounds");
}

module.exports = middlewarObj;