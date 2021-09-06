const express = require("express");
const { validationResult } = require("express-validator");
const fs = require("fs");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const router = express.Router();

// @route POST api/users
// @desc Create user (FormData Format)
// @access Public
/*
router.post("/", (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json({ err: err.array });
  } else {
    res.status(200);
  }

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).send(err);
    }

    let userFields = User(fields);
    const { name, email, password, designation, institution } = userFields;

    if (!name) res.status(400).send("Name is required");
    if (!email) res.status(400).send("Email is required");
    if (!password) res.status(400).send("Password is required");
    if (!designation) res.status(400).send("Designation is required");
    if (!institution) res.status(400).send("Institution is required");

    if (designation == "HOD" || designation == "Faculty") {
      notificationMessage = undefined;
      notifications = undefined;
    }

    // if (files.profilepic) {
    //   userFields.profilepic.data = fs.readFileSync(files.profilepic.path);
    //   userFields.profilepic.contentType = files.profilepic.type;
    // }

    const salt = await bcrypt.genSalt(10);
    userFields.password = await bcrypt.hash(password, salt);

    userFields.save((err, result) => {
      if (err) {
        res.status(400).send(err);
      }
      return res.status(200).json(result);
    });
  });
});
*/

// @route POST api/users
// @desc Create user (JSON Format)
// @access Public
router.post("/", async (req, res) => {
  const { name, email, password, designation, institution, year, department } =
    req.body;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashed,
    designation,
    institution,
    year,
    department,
  });

  await user.save((err, result) => {
    if (err) {
      return res.status(400);
    }
    return res.status(200).json(user);
  });
});

// @route GET api/users/faculty_members
// @desc get all the 'Faculty' profiles
// @access Public
router.get("/faculty_members", auth, async (req, res) => {
  const user = await User.find({ verified: true }).select("-password");
  let facultyMembers = [];
  user.map((u) => {
    if (u.designation !== "Student") {
      facultyMembers.push(u.name);
    }
  });

  return res.status(200).json(facultyMembers);
});

// @route PUT api/users/verification-mail
// @desc send verification mail
// @access public
router.get("/verification-mail/:emailID", (req, res) => {
  User.findOne({ email: req.params.emailID })
    .select("-password")
    .exec((err, result) => {
      if (err) {
        console.log(err);
      }
      const { _id } = result;
      const randomText = randomstring.generate(50);

      let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSWORD}`,
        },
      });

      let mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${req.params.emailID}`,
        subject: "Verification Mail",
        text: `Welcome! Click the link to verify your email ${process.env.CLIENT_URL}/verify/${_id}/account-verification/${randomText}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json(info.response);
        }
      });
    });
});

// @route PUT api/users/requsest-verify-email
// @desc request for email verification
// @access public
router.put("/request-user-verify/:userID", (req, res) => {
  User.findOne({ _id: req.params.userID })
    .select("-password")
    .exec((err, user) => {
      if (err) {
        console.log(err);
      }
      user.verified = true;
      user.save((err, result) => {
        if (err) {
          console.log(err);
        }

        return res.status(200).json(result);
      });
    });
});

// @route GET api/users/generate-otp
// @desc get otp for forgot password
// @access public
router.put("/generate-otp/:emailID", (req, res) => {
  User.findOne({ email: req.params.emailID })
    .select("-password")
    .exec((err, user) => {
      if (err) {
        return res.status(404).json("FAILED");
      }
      const otp = randomstring.generate({
        length: 6,
        charset: "octal",
      });
      user.otp = otp;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSWORD}`,
        },
      });

      let mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${req.params.emailID}`,
        subject: "Reset OTP",
        text: `Your reset OTP ${otp}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json(info.response);
        }
      });

      user.save((err, result) => {
        if (err) {
          console.log(err);
        }

        return res.status(200).json("SUCCESS");
      });
    });
});

// @route GET api/users/match-otp/:emailID
// @desc match the otp send
// @access Public
router.put("/verify-otp/:emailID", (req, res) => {
  const { otp } = req.body;

  User.findOne({ email: req.params.emailID })
    .select("-password")
    .exec((req, user) => {
      if (user.otp == otp) {
        return res.status(200).json("SUCCESS");
      } else {
        return res.status(400).json("FAILED");
      }
    });
});

// @route PUT api/users/reset-password/:emailID
// @desc reset user password
// @access Public
router.put("/reset-password/:emailID", (req, res) => {
  const { password, confirmPassword } = req.body;
  User.findOne({ email: req.params.emailID })
    .select("-password")
    .exec(async (err, user) => {
      if (password === confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        user.password = hashed;

        user.save((err, result) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).json(result);
        });
      }
    });
});

// @route GET api/users/remove-otp
// @desc delete the otp store
// @access Public
router.get("/remove-otp/:emailID", (req, res) => {
  User.findOne({ email: req.params.emailID })
    .select("-password")
    .exec((err, user) => {
      user.otp = undefined;
      user.save((err, result) => {
        if (err) {
          console.log(err);
        }

        return res.status(200).json(result);
      });
    });
});

// @route GET api/users/profile
// @desc get user profile
// @access Private
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  return res.status(200).json(user);
});

// @route GET api/users/get-notifications
// @desc get current user notifications
// access Private
router.get("/get-notifications", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id }).select("-password");
  if (user.notificationMessage.length != 0) {
    return res.status(200).json(user.notificationMessage);
  } else {
    return res.status(400).send("No notifications yet");
  }
});

// @route DELETE api/users/:notification_id/delete-notification
// @desc delete a particular notification
// access Private
router.delete(
  "/:notification_id/delete-notification",
  auth,
  async (req, res) => {
    const user = await User.findOne({ _id: req.user.id }).select("-password");
    if (user.notificationMessage.length != 0) {
      user.notificationMessage.map((message) => {
        if (message._id.toString() == req.params.notification_id) {
          message.remove();
        }
        user.save((err, result) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).send("notification deleted");
        });
      });
    }
  }
);

// @route DELETE api/users/delete-all-notifications
// @desc delete all notifications of current user notifications
// access Private
router.delete("/delete-all-notifications", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id }).select("-password");
  if (user.notificationMessage.length != 0) {
    user.notificationMessage = undefined;
    user.notifications = undefined;
  }
  user.save((err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(user);
  });
});

// @route PUT api/users/edit-user
// @desc edit designation, institution, year
// access Private
router.put("/edit-user", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const { designation, institution, year, department } = req.body;

  if (designation) {
    user.designation = designation;
  }

  if (institution) {
    user.institution = institution;
  }

  if (department) {
    user.department = department;
  }

  if (year) {
    user.year = year;
  }

  user.save((err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(user);
  });
});

module.exports = router;
