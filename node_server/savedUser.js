const express = require("express");
const router = express.Router();
var mong = require("mongoose");
var multer = require("multer");
const user = require("./models/userSchema");
const saved = require("./models/savedFaceSchema");
var fs = require("fs");
var request = require("request");
const image2base64 = require("image-to-base64");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
      cb(
        null,
        new Date().getHours() +
          new Date().getMinutes() +
          new Date().getSeconds() +
          file.originalname
      );
    }
  });
  const upload = multer({
    storage: storage
  });
  
router.get("/", (req, res, next) => {
    saved
    .find()
    .select("name photo base64Format")
    .exec()
    .then(doc => {
    

      res.status(200).json(doc);
    });
});
router.post("/", upload.single("media"), function(req, res, next) {
    console.log(req.body.name);
    image2base64("uploads/" + req.file.filename).then(
        response => {
          base64Img = response;
     
    const po = new saved({
        _id: new mong.Types.ObjectId(),
        name: req.body.name,
        photo: req.file.filename,
        base64Format: base64Img
      });

      po.save().then(
        res => {
          //console.log(res);
        },
        err => {
          //console.log(err);
        }
      ); 
}); });
module.exports = router;