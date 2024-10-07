const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/articles");

// MEMBUAT SCHEMA
// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "nama tidak boleh kosong"],
//     },
//     username: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true },
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;

// // MENAMBAH SATU DATA
// const penggunaBaru = new User({
//   name: "Muhammad Azwar",
//   username: "muhanaz",
//   email: "muhanaz@gmail.com",
//   password: "serperempat",
// });

// // SIMPAN KEDALAM COLLECTION
// penggunaBaru.save().then((usr) => console.log(usr));

// const postSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     author: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//     },
//     body: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true },
// );

// const Post = mongoose.model("Post", postSchema);

// const postBaru = new Post({
//   title: "Steve Jobs",
//   author: "Walter Isaacson",
//   slug: "steve-jobs",
//   body: 'Steve Jobs is the authorized biography of Steve Jobs, the co-founder of Apple Inc. The book was written at Jobs request by Walter Isaacson, a well-known journalist who had previously written biographies of Benjamin Franklin and Albert Einstein. The book was published in 2011, shortly after Jobs death. It is based on more than 40 interviews with Jobs over two years, as well as interviews with more than 100 other people, including family, friends, rivals, and colleagues. Isaacson was also given "unprecedented" access to Jobs private life.',
// });

// postBaru.save().then((result) => console.log(result));
