const { Router } = require("express");
const multer = require("multer");
const path = require("path"); //so that we dont always have to use the absolute path

const UserPosts = require("../models/user-posts");
const PostImpressions = require("../models/post-impressions");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/user-posts/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// router.get("/happening-now", async(req, res) => {
//   const comments = await PostImpressions.find({ userPostId: req.params.id}).populate('createdBy')
//   // to see the user post
//   //social media posts route
//   console.log(comments)
//   return res.render("happening-now", {
//     user: req.user,
//     comments, //an array
//   });
// });

router.get("/happening-now", async (req, res) => {
  const comments = await PostImpressions.find({
    impressionType: "COMMENT",
  }).populate("createdBy");

    const likes = await PostImpressions.find({
    impressionType: "LIKE",
  });

  const allPosts = await UserPosts.find({})
    .populate("createdBy")
    .sort({ createdAt: -1 });
  res.render("happening-now", {
    user: req.user,
    userposts: allPosts,
    comments,
    likes,
  });
  // res.render("happening-now", {
  //   user: req.user,
  //   userposts,
  //   comments,
  // });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  // to post something in the feed
  //social media post - by users or business owners
  const { title, content, location } = req.body;
  const userposts = await UserPosts.create({
    title,
    content,
    createdBy: req.user._id,
    location,
    coverImageURL: req.file ? `/uploads/user-posts/${req.file.filename}` : null,
  });
  return res.redirect("/user-posts/happening-now");
});

router.post("/comment/:userPostId", async (req, res) => {
  await PostImpressions.create({
    impressionType: "COMMENT",
    content: req.body.comment,
    userPostId: req.params.userPostId,
    createdBy: req.user._id,
  });

  return res.redirect("/user-posts/happening-now");
});

router.post("/delete/:id", async (req, res) => {
  console.log("DELETE ROUTE HIT", req.params.id); 
  const post = await UserPosts.findById(req.params.id);
  if (!post) {
    return res.redirect("/user-posts/happening-now");
  }
  if (post.createdBy.toString() !== req.user._id.toString()) {    // Ownership check — only the creator can delete
    return res.status(403).send("You are not authorized to delete this post");
  }
  await UserPosts.findByIdAndDelete(req.params.id);
  await PostImpressions.deleteMany({ userPostId: req.params.id });   // Optional: also clean up comments/likes tied to this post
  return res.redirect("/user-posts/happening-now");
});


// LIKE ROUTE FOR SOCIAL MEDIA POSTS
router.post("/like/:postId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to like a post");
  }

  const existingLike = await PostImpressions.findOne({
    userPostId: req.params.postId,
    createdBy: req.user._id,
    impressionType: "LIKE",
  });

  if (existingLike) {
    // Already liked -> unlike
    await PostImpressions.findByIdAndDelete(existingLike._id);
  } else {
    // Not liked yet -> like
    await PostImpressions.create({
      impressionType: "LIKE",
      userPostId: req.params.postId,
      createdBy: req.user._id,
    });
  }

  return res.redirect("/user-posts/happening-now");
});

module.exports = router;
