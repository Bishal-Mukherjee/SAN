const express = require("express");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const Notice = require("../models/Notice");
const router = express.Router();

// @route POST api/notices/create-notice
// @desc Create a notice
// @access private (Admin | HOD)
router.post("/create-notice", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const { message, salutation, department, year } = req.body;

  if (user.designation == "Admin" || user.designation == "HOD") {
    const notice = new Notice({
      message,
      salutation,
      department,
      year,
    });
    notice.user = req.user.id;
    notice.institution = user.institution;

    notice.save((err, result) => {
      if (err) {
        console.log(err);
      }
      return res.status(200).json(notice);
    });
  } else {
    return res.status(400).send("Authorization denied");
  }
});

// @route GET api/notices/get-notices
// @desc Get all notices
// @access public
router.get("/get-notices", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  try {
    const notices = await Notice.find({
      department: user.department,
      year: user.year,
      institution: user.institution,
    }).sort({ _id: "-1" });
    return res.status(200).json(notices);
  } catch (err) {
    console.log(err);
  }
});

// @route PUT api/notices/get-notices
// @desc Get all notices
// @access public
// router.put("/edit-notices", async (req, res) => {
//   const notices = await Notice.find({
//     institution: "St. Xavier's College, Burdwan",
//   });

//   // notices.map((notice) => {
//   //   notice.institution = "St. Xavier's College, Burdwan";
//   //   notice.save((err, result) => {
//   //     if (err) {
//   //       console.log(err);
//   //     }
//   //   });
//   // });
//   console.log(notices);
// });

module.exports = router;
