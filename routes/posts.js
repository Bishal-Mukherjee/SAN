const express = require("express");
const formidable = require("formidable");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const fs = require("fs");
const Post = require("../models/Post");
const { route } = require("./notices");
const router = express.Router();

// @route POST api/posts/multiple-images
// @desc Create a post multiple images
// access private
// router.post("/multiple-images", auth, async (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.multiples = true;
//   let index = 0;

//   const user = await User.findById(req.user.id).select("-password");

//   if (
//     user.designation === "Admin" ||
//     user.designation === "Faculty" ||
//     user.designation === "HOD"
//   ) {
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         res.status(400).send(err);
//       }

//       let post = new Post(fields);
//       post.user = req.user.id;
//       post.name = user.name;
//       post.institution = user.institution;
//       post.department = user.department;
//       post.photo = undefined;
//       post.pdfdocument = undefined;

//       if (files.photos) {
//         files.photos.forEach((file) => {
//           index = index + 1;
//           post.photos.push({
//             photoID: index,
//             data: fs.readFileSync(file.path),
//             contentType: file.type,
//           });
//         });
//       }

//       post.save((err, result) => {
//         if (err) {
//           return res.status(400).json(err);
//         }

//         res.status(200).json(post);
//       });
//     });
//   } else {
//     return res.status(400).send("Authorization Denied");
//   }
// });

// // @route POST api/posts/single-image
// // @desc Create a post with single image
// // access private
// router.post("/single-image", auth, async (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;

//   const user = await User.findById(req.user.id).select("-password");

//   if (
//     user.designation === "Admin" ||
//     user.designation === "Faculty" ||
//     user.designation === "HOD"
//   ) {
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         res.status(400).send(err);
//       }

//       let post = new Post(fields);
//       post.user = req.user.id;
//       post.name = user.name;
//       post.institution = user.institution;
//       post.department = user.department;
//       post.photos = undefined;
//       post.pdfdocument = undefined;

//       if (files.photo) {
//         post.photo.data = fs.readFileSync(files.photo.path);
//         post.photo.contentType = files.photo.type;
//       }

//       post.save((err, result) => {
//         if (err) {
//           return res.status(400).json(err);
//         }

//         res.status(200).json(post);
//       });
//     });
//   } else {
//     return res.status(400).send("Authorization Denied");
//   }
// });

// // @route POST api/posts/pdf-document
// // @desc Create a post with pdf document
// // access private
// router.post("/pdf-document", auth, async (req, res) => {
//   console.log("working");
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;

//   const user = await User.findById(req.user.id).select("-password");

//   if (
//     user.designation === "Admin" ||
//     user.designation === "Faculty" ||
//     user.designation === "HOD"
//   ) {
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         res.status(400).send(err);
//       }

//       let post = new Post(fields);
//       post.user = req.user.id;
//       post.name = user.name;
//       post.institution = user.institution;
//       post.department = user.department;
//       post.photos = undefined;
//       post.photo = undefined;

//       if (files.pdf) {
//         post.pdfdocument.data = fs.readFileSync(files.pdf.path);
//         post.pdfdocument.contentType = files.pdf.type;
//       }

//       post.save((err, result) => {
//         if (err) {
//           return res.status(400).json(err);
//         }

//         res.status(200).json(post);
//       });
//     });
//   } else {
//     return res.status(400).send("Authorization Denied");
//   }
// });

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
      if (user.designation === "HOD") {
        post.department = user.department;
      }

      if (!files.photo && !files.photos && !files.pdf) {
        post.photos = undefined;
        post.save((err, result) => {
          if (err) {
            console.log(err);
          }

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

          return res.status(200).json(result);
        });
      }
    });
  } else {
    return res.status(400).json("Authorization denied");
  }
});

// @route GET api/posts/user_posts
// @desc Get a particular user posts
// @access Private
router.get("/:user_name/posts", auth, async (req, res) => {
  const user = await User.findOne({ name: req.params.user_name });
  const posts = await Post.find({ user: user._id, approval: true }).sort({
    _id: -1,
  });
  if (posts) {
    return res.status(200).json(posts);
  } else {
    return res.status(400).send("No posts yet");
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

// @route GET api/posts/:post_id/remove-notifications
// @desc get all the notications of a particular post, from notificationMessage[]
// access Public
router.put("/:post_link/remove-notification", auth, (req, res) => {
  Post.findById(req.params.post_link).exec(async (err, post) => {
    let { department, institution, year } = post;

    const user = await User.find({
      department,
      institution,
      year,
      designation: "Student",
    });

    user.map((u) => {
      u.notificationMessage = undefined;
      u.save();
    });
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
    const posts = await Post.find({ approval: true }).sort({ _id: -1 });
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

    if (result.photos.length === 0) {
      console.log("photos length is zero");
      result.photos = undefined;
    }

    return res.status(200).json(result);
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
    return res.status(400).json("Post does exist");
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

// @route GET api/posts/view_photo/:post_id
// @desc view the post photo
// @access private
// router.put("/edit", async (req, res) => {
//   const posts = await Post.find({});

//   posts.map(async (post) => {
//     const user = await User.findById(post.user);
//     const { name } = user;
//     post.name = name;
//     post.save((err, result) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   });
// });

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
