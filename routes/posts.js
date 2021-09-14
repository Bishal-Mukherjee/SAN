const express = require("express");
const formidable = require("formidable");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const fs = require("fs");
const Post = require("../models/Post");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;
  const user = await User.findById(req.user.id).select("-password");
  let index = 0;

  if (
    user.designation === "Admin" ||
    user.designation === "HOD" ||
    user.designation === "Faculty"
  ) {
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).json(err);
      }

      let post = new Post(fields);
      post.user = req.user.id;
      post.name = user.name;
      post.institution = user.institution;

      if (!files.photo && !files.photos && !files.pdf) {
        post.photos = undefined;
        post.save((err, result) => {
          if (err) {
            console.log(err);
          }

          sendNotification(result);
          return res.status(200).json(result);
        });
      }

      if (files.photo) {
        post.photos = undefined;
        post.pdfdocument = undefined;
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
        post.save((err, result) => {
          if (err) {
            console.log(err);
          }
          sendNotification(result);
          return res.status(200).json(result);
        });
      }

      if (files.photos) {
        post.photo = undefined;
        post.pdfdocument = undefined;

        files.photos.forEach((f) => {
          index = index + 1;
          post.photos.push({
            photoID: index,
            data: fs.readFileSync(f.path),
            contentType: f.type,
          });
        });

        post.save((err, result) => {
          if (err) {
            console.log(err);
          }
          sendNotification(result);
          return res.status(200).json(result);
        });
      }

      if (files.pdf) {
        post.photos = undefined;
        post.photo = undefined;
        post.pdfdocument.data = fs.readFileSync(files.pdf.path);
        post.pdfdocument.contentType = files.pdf.type;

        post.save((err, result) => {
          if (err) {
            console.log(err);
          }
          sendNotification(result);
          return res.status(200).json(result);
        });
      }
    });
  } else {
    return res.status(400).json("Authorization denied");
  }
});

async function sendNotification(post) {
  const { name, institution, year, department, _id } = post;
  const newNotification = {
    text: `${name} has posted an assignment`,
    post_link: _id,
  };

  const students = await User.find({
    designation: "Student",
    institution,
    year,
    department,
  });

  students.map((student) => {
    student.notificationMessage.unshift(newNotification);
    student.save((err, result) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

// @route GET api/posts/user_posts
// @desc Get a particular user posts
// @access Private
router.get("/:user_name/posts", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const faculty = await User.findOne({ name: req.params.user_name });
  const posts = await Post.find({
    user: faculty._id,
    department: user.department,
  }).sort({
    _id: -1,
  });
  if (posts.length !== 0) {
    return res.status(200).json(posts);
  } else {
    return res.status(404).json("NULL");
  }
});

// @route GET api/posts/all-posts
// @desc Get all posts in database
// @access Private(Admin)
router.get("/all-posts", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .exec((err, user) => {
      if (err) {
        console.log(err);
      }
      if (user.designation === "Admin") {
        Post.find({})
          .sort({ _id: -1 })
          .exec((err, posts) => {
            if (err) {
              console.log(err);
            }

            return res.status(200).json(posts);
          });
      } else {
        return res.status(400).json("Authorization denied");
      }
    });
});

router.get("/:post_id/is_exists", auth, (req, res) => {
  Post.findOne({ _id: req.params.post_id }).exec((err, result) => {
    if (err) {
      console.log(err);
    }

    if (result) {
      res.status(200).send("EXISTS");
    } else {
      res.status(404).send("NON");
    }
  });
});

// @route GET api/posts/pending
// @desc Get all pending posts
// @access Private(Admin)
router.get("/pending", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.designation == "Admin") {
    /* get the pending (approval: false) posts */
    const posts = await Post.find({ approval: false }).sort({ _id: -1 });
    return res.status(200).json(posts);
  } else {
    if (user.designation == "HOD" || user.designation == "Faculty") {
      User.findById(req.user.id)
        .select("-password")
        .exec((err, user) => {
          if (err) {
            console.log(err);
          }

          Post.find({ user: req.user.id })
            .sort({ _id: -1 })
            .exec((err, posts) => {
              if (err) {
                console.log(err);
              }

              return res.status(200).json(posts);
            });
        });
    } else {
      res.status(400).send("Authorization denied");
    }
  }
});

// @route GET api/posts
// @desc Get approved posts
// @access Private
router.get("/", auth, async (req, res) => {
  /* get the approved (approval: true) posts */
  try {
    const posts = await Post.find({}).sort({ _id: -1 });
    if (posts) {
      return res.status(200).json(posts);
    }
  } catch (err) {
    console.log(err);
  }
});

// @route GET api/posts
// @desc Get approved posts
// @access Private
router.get("/", auth, async (req, res) => {
  /* get the approved (approval: true) posts */
  const posts = await Post.find({ approval: true }).sort({ _id: -1 });
  return res.status(200).json(posts);
});

// router.put("/edit-all-posts", auth, (req, res) => {
//   Post.find({ institution: "St. Xavier's College, Burdwan" }).exec(
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(result);
//     }
//   );
// });

// @route PUT api/posts/approve/:post_id
// @desc Approve a post
// @access Admin(Private)
router.put("/approve/:post_id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.designation == "Admin") {
    const post = await Post.findById(req.params.post_id);
    const postedBy = await User.findById(post.user).select("-password");
    const { name } = postedBy;

    const newNotification = {
      text: `${name} has posted an assignment`,
      post_link: req.params.post_id,
    };

    const students = await User.find({
      designation: "Student",
      institution: post.institution,
      year: post.year,
      department: post.department,
    });

    students.map((student) => {
      student.notificationMessage.unshift(newNotification);
      student.save((err, result) => {
        if (err) {
          console.log(err);
        }
      });
    });

    // students.save((err, result) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });

    if (post.approval == true) {
      return res.status(400).send("already approved");
    }
    post.approval = true;
    post.save((err, result) => {
      if (err) {
        console.log(err);
      }
      if (post.photos.length === 0) {
        post.photos = undefined;
      }
      res.status(200).json("approved");
    });
  } else {
    return res.status(400).send("Authorization denied");
  }
});

// @route GET api/post/notifications
// @desc get all users notifications
// access private
router.get("/notifications", auth, (req, res) => {
  User.findById(req.user.id).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(result.notificationMessage);
  });
});

// @route GET api/posts/view-post/:postID
// @desc get post from notification
// access private
router.get("/view-post/:postID", auth, (req, res) => {
  Post.findById(req.params.postID).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      if (result.photos.length === 0) {
        result.photos = undefined;
      }

      return res.status(200).json(result);
    } else {
      return res.status(404).json("Not Found");
    }
  });
});

// @route DELETE api/post/notifications
// @desc get all users notifications
// access private
router.delete("/delete-notifications", auth, (req, res) => {
  User.findById(req.user.id).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    result.notificationMessage = undefined;

    result.save((err, result) => {
      if (err) {
        console.log(err);
      }

      return res.status(200).json("success");
    });
  });
});

// @route api/posts/filteredPosts
/* @desc approved posts, only students with correct institution, 
    year,department and for faculties of the institution  */
// @access Private
router.get("/filtered-posts", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.designation == "Faculty") {
    const posts = await Post.find({
      approval: true,
      institution: user.institution,
    });
    return res.status(200).json(posts);
  }

  if (user.designation == "Student") {
    const posts = await Post.find({
      approval: true,
      institution: user.institution,
      year: user.year,
      department: user.department,
    });

    return res.status(200).json(posts);
  }
});

// @route PUT api/posts/:post_id/doubts
// @desc Put doubts
// @access Private
router.put("/:post_id/write-doubts", auth, async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  const user = await User.findById(req.user.id);
  const { text } = req.body;
  post.doubts.push({ text, user: req.user.id, name: user.name });
  post.save((err, result) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(post);
  });
});

// @route PUT api/posts/:post_id/get-doubts
// @desc get the doubts asked
// @access Private
router.get("/:post_id/doubts", auth, async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  return res.status(200).json(post.doubts);
});

// @route DELETE api/posts/:post_id
// @desc Delete post by ID
// @access Private
/* posts can be deleted by the person who posted id and by User */
router.delete("/delete/:post_id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  let post = await Post.findById(req.params.post_id);
  if (!post) {
    return res.status(404).json("Post does exist");
  }
  if (user.designation === "Admin" || user._id.toString() == post.user) {
    post = await Post.findByIdAndRemove(req.params.post_id);
  }
  return res.status(200).json("Post deleted");
});

// @route GET api/posts/view_photo/:post_id
// @desc view the post photo
// @access private
router.get("/view_photo/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  if (post_id) {
    await Post.findById({ _id: post_id }).exec((err, result) => {
      if (result.photo.data) {
        res.set("Content-Type", result.photo.contentType);
        return res.send(result.photo.data);
      }
    });
  }
});

// @route GET api/posts/:post_id
// @desc Get post image
// @access private
router.get("/get-images/:post_id/:photoID", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.post_id });
  let image;
  post.photos.map((photo) => {
    if (photo.photoID == `${req.params.photoID}`) {
      image = photo;
    }
  });

  if (image) {
    res.set("Content-Type", image.contentType);
    return res.send(image.data);
  }
});

// @route api/posts/:post_id/view-pdf
// @desc view the pdf file contained by the post
// @access private
router.get("/view-pdf/:post_id", async (req, res) => {
  const post = await Post.findById(req.params.post_id);
  const { pdfdocument } = post;

  if (pdfdocument) {
    res.set("Content-Type", pdfdocument.contentType);
    return res.send(pdfdocument.data);
  }
});

module.exports = router;
