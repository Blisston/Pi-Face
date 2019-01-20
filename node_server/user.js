const express = require("express");
const router = express.Router();
var multer = require("multer");
var mong = require("mongoose");
const user = require("./models/userSchema");
const saved = require("./models/savedFaceSchema");
var fs = require("fs");
var request = require("request");
const image2base64 = require("image-to-base64");
const twilio = require("twilio");

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
  user
    .find()
    .select("name photo base64Format")
    .exec()
    .then(doc => {
      res.status(200).json(doc);
    });
});

router.post("/", upload.single("media"), function(req, res, next) {
  let img1;
  let nameOfPerson = "unknown";
  let base64Img;

  let fet = () => {
    return new Promise((res, rej) => {
      res(
        user
          .find()
          .select("photo")
          .exec()
          .then(doc => {
            img1 = doc[doc.length - 1].photo;
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
                      console.log("uploads/" + req.file.filename);

                      if (JSON.parse(body).confidence > 70) {
                        image2base64("uploads/" + req.file.filename).then(
                          response => {
                            base64Img = response;

                            nameOfPerson = i.name;
                            const po = new user({
                              _id: new mong.Types.ObjectId(),
                              name: nameOfPerson,
                              photo: req.file.filename,
                              base64Format: base64Img
                            });
                            sendMessage(nameOfPerson);
                            po.save().then(
                              res => {
                                console.log("known");
                              },
                              err => {
                                console.log(err);
                              }
                            );
                          }
                        );
                      } else {
                        image2base64("uploads/" + req.file.filename).then(
                          response => {
                            base64Img = response;

                            const po = new user({
                              _id: new mong.Types.ObjectId(),
                              name: nameOfPerson,
                              photo: req.file.filename,
                              base64Format: base64Img
                            });

                            po.save().then(
                              res => {
                                console.log("unkonwn");
                              },
                              err => {
                                console.log(err);
                              }
                            );
                          }
                        );
                      }
                    });
                  });
                })
            );
          });
        };
        userGet().then(() => {});
      } else {
        fs.unlink("uploads/" + req.file.filename);
      }
    });
    function sendMessage(x) {
      let client = new twilio(
        "AC5e59fdbd81d2373e4192b67b306045cf",
        "48d93d5e745ed99762dc41b8a94d56ec"
      );

      client.messages.create(
        {
          to: "+918667084511",
          from: "+12243007624",
          body: "At door  " + x
        },
        (err, res) => {
          if (err) console.log(`An error has ocurred: ${err}`);
          else
            console.log(`¡SMS Success! Date:${res.dateCreated} Id: ${res.sid}`);
        }
      );
    }
  });
  res.send("hi");
});

module.exports = router;
