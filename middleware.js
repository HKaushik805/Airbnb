const Listing = require("./models/listing"); //for isOwner
const Review = require("./models/review"); //for isreviewAuthor
const ExpressError = require("./utils/ExpressError.js");//for validateListing, validateReview
const {listingSchema, reviewSchema} = require("./schema.js");//for validateListing



module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) { //to check user is logged in or not
        // redirect Url save
        req.session.redirectUrl = req.orignalUrl;
        req.flash("error", "You must logged in to that!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
      res.locals.redirectUrl=req.session.redirectUrl;
    };
    next();
  }

module.exports.isOwner = async(req, res, next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission for that!");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
      if(error){
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
      } else{
          next();
      }
}

module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
      if(error){
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
      } else{
          next();
      }
}

module.exports.isreviewAuthor = async(req, res, next) => {
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }