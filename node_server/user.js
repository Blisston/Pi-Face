const express = require("express");
const router = express.Router();
var multer = require("multer");
var mong = require("mongoose");
const user = require("./models/userSchema");
const saved = require("./models/savedFaceSchema");
var fs = require("fs");
var request = require("request");

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
  // user.findById('5c209443b43e6e195c4e9988').exec().then(doc =>
  //     {
  //         console.log(doc);
  //         res.status(200).json(doc);
  //     }).catch(err =>
  //         {
  //         })
    saved
      .find()
      .select("name")
      .exec()
      .then(doc => {
        res.status(200).json(doc);
      });
//   const po = new saved({
//     _id: new mong.Types.ObjectId(),
//     name: "blisston",
//     photo:"7601.jpg"
//   });
//   po.save().then(
//     res => {
//       console.log(res);
//     },
//     err => {
//       console.log(err);
//     }
//   );
});

router.post("/", upload.single("media"), function(req, res, next) {
  let img1;

  const po = new user({
    _id: new mong.Types.ObjectId(),
    name: req.file.filename
  });

  let fet = () => {
    return new Promise((res, rej) => {
      res(
        user
          .find()
          .select("name")
          .exec()
          .then(doc => {
            img1 = doc[doc.length - 1].name;
            console.log(img1);
          })
      );
    });
  };
  fet().then(() => {
    var options;

    options = {
      method: "POST",
      url: "https://api-us.faceplusplus.com/facepp/v3/compare",
      qs: {
        api_key: "-FiVbRYI9bShLvQz9cQyTjiBjpbUE2Cj",
        api_secret: "0MF9kO1hDEHDYeFyQDF2_zE513BZE2g9"
      },
      headers: {
        "Postman-Token": "2b8b3683-3b96-4042-953d-cba297a9eb9a",
        "cache-control": "no-cache",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
      },
      formData: {
        image_file1: {
          value: fs.createReadStream("uploads/" + img1),
          options: { filename: "", contentType: null }
        },
        image_file2: {
          value: fs.createReadStream("uploads/" + req.file.filename),
          options: { filename: "", contentType: null }
        }
      }
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);

      console.log(JSON.parse(body).confidence);
      if (parseInt(JSON.parse(body).confidence) < 70) {
        let userGet = () => {
          return new Promise((res, rej) => {
            res(
              saved
                .find()
                .select("name photo")
                .exec()
                .then(doc => {
                  doc.forEach(i => {
                    img1 = i.photo;
                    console.log(i);
                    var options;

                    options = {
                      method: "POST",
                      url: "https://api-us.faceplusplus.com/facepp/v3/compare",
                      qs: {
                        api_key: "-FiVbRYI9bShLvQz9cQyTjiBjpbUE2Cj",
                        api_secret: "0MF9kO1hDEHDYeFyQDF2_zE513BZE2g9"
                      },
                      headers: {
                        "Postman-Token": "2b8b3683-3b96-4042-953d-cba297a9eb9a",
                        "cache-control": "no-cache",
                        "content-type":
                          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
                      },
                      formData: {
                        image_file1: {
                          value: fs.createReadStream("uploads/" + img1),
                          options: { filename: "", contentType: null }
                        },
                        image_file2: {
                          value: fs.createReadStream(
                            "uploads/" + req.file.filename
                          ),
                          options: { filename: "", contentType: null }
                        }
                      }
                    };

                    request(options, function(error, response, body) {
                      if (error) throw new Error(error);
                      if (JSON.parse(body).confidence > 70) {
                        console.log(i.name);
                      }
                    });
                  });
                })
            );
          });
        };
        userGet().then(() => {});
        po.save().then(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
      } else {
        fs.unlink("uploads/" + req.file.filename);
      }
    });
  });
  res.send("hi");
});

module.exports = router;
