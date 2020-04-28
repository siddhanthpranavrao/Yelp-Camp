const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  sessions = require("client-sessions"),
  methodOverride = require("method-override"),
  bcrypt = require("bcryptjs"),
  flash = require("connect-flash"),
  Campground = require("./models/campgrounds"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

const campgroundRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//seedDB(); //Seed the database

app.use(flash());
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`));
app.use(
  sessions({
    cookieName: "session",
    secret: "0bhegf94rvkjsdhdp9",
    duration: 30 * 60 * 1000,
    httpOnly: true,
  })
);

//SEND THE USER DATA TO ALL PAGES
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  if (!(req.session && req.session.userId)) {
    req.user = undefined;
    res.locals.user = undefined;
    return next();
  }

  User.findById(req.session.userId, (err, user) => {
    user.password = undefined;

    req.user = user;
    res.locals.user = user;

    next();
  });
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(5000, () => {
  console.log("The YelpCamp Server is listening to Port 5000:");
});
