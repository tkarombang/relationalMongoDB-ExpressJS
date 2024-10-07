const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);

module.exports = User;
