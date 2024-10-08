const mongoose = require("mongoose");

const Post = require("./post");

// MEMBUAT SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "nama tidak boleh kosong"],
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true },
);

userSchema.post("findOneAndDelete", async function (users) {
  if (users.posts.length) {
    const res = await Post.deleteMany({ _id: { $in: users.posts } });
    console.log(res);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
