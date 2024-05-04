const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router
  .route("/")
    .get( wrapAsync(listingController.index)) //Index route
    .post( isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)) //Create route


// New Route
router.get("/new", isLoggedIn, listingController.newForm);


router
  .route("/:id")
  .get( wrapAsync(listingController.showListing)) //Show route
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) //Update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)) //Delete route



// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editListing);


module.exports = router;