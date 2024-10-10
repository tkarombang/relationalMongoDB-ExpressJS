# Impementasi Relasi Database MongoDB di Express, Mongoose

## Tentang Kelas

Panduan untuk mempelajari Panduan untuk mempelajari implementasi relasi database MongoDB di Express, Mongoose

## Target dan Sasaran Siswa

Kelas ini cocok untuk:

- Kelas ditujukan bagi mereka yang tertarik untuk mempelajari Panduan untuk mempelajari implementasi relasi database MongoDB di Express, Mongoose
- Siswa harus bisa belajar mandiri. Karena pada kelas ini siswa harus mengatur jadwal belajarnya sendiri.

## Tujuan Umum dan Khusus Pelatihan

- **Tujuan Umum**: Di akhir kelas, siswa dapat memahami Panduan untuk mempelajari implementasi relasi database MongoDB di Express, Mongoose
- **Silabus**: Memahami Panduan untuk mempelajari implementasi relasi database MongoDB di Express, Mongoose

### Metode Ajar Online Self-paced Learning Siswa dapat menentukan sendiri waktu belajarnya

## Silabus

1. **Membuat Model Untuk Contoh Author Dan Postingannya** _(05:08)_
2. **Membuat Halaman Index Dan Membuat Data User** _(06:19)_
3. **Menampilkan Data User dan Tampilannya** _(03:44)_
4. **Menyimpan Sebuah Data Post Ke-Model User** _(07:17)_
5. **Menampilkan Data Post di Tampilkan Detail User** _(05:50)_
6. **Menampilkan Data User Di Halaman Detail Post** _(02:45)_
7. **Memanfaatkan Middleware Schema Untuk Menghapus Data** _(06:60)_

## Screenshot

```js
app.get("/users", async (req, res) => {
  const dataUser = await User.find();
  res.render("users/index", {
    title: "Index User",
    dataUser,
  });
});
```

<img src="./assets/0.View-user.png" alt="User View" width="600" height="600"> </div> </div>

```js
// HALAMAN TAMBAH DATA USER
app.get("/users/create", (req, res) => {
  res.render("users/create", {
    title: "Create Author",
  });
});
// PROCESS CREATE DATA USER
app.post("/users/create", async (req, res) => {
  // const dataUser = new User(req.body);
  // console.log(dataUser);
  // await dataUser.save();
  await User.insertMany(req.body);
  res.redirect("/users");
});
```

#### Add Author Page

<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <img src="/assets/1.add.png" alt="add"> 
      <img src="/assets/2.add-form.png" alt="add-form">
      <img src="/assets/4.mongo.png" alt="add-form">
  </div>

#### Create Post

```js
// CREATE POST BY USER
app.get("/users/:id/posts/create", async (req, res) => {
  const userId = await User.findOne({ _id: req.params.id });
  res.render("posts/create", {
    title: "Create Post",
    userId,
  });
});
// PROCESS CREATE POST BY USER
app.post("/users/:id/posts/create", async (req, res) => {
  const author = await User.findOne({ _id: req.params.id });
  const article = new Post(req.body);

  author.posts.push(article);
  article.users = author;
  await author.save();
  await article.save();
  console.log(author);
  res.redirect(`/users/author/${author._id}`);
});
// DETAIL POSTS BY USER
app.get("/posts/:id", async (req, res) => {
  const dataPost = await Post.findOne({ _id: req.params.id }).populate("users");
  res.render("posts/index", {
    title: "Articles",
    dataPost,
  });
});
```

<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <img src="/assets/create/beforeCreatePost.png" alt="add"> 
      <img src="/assets/create/processCreatePost.png" alt="add"> 
      <img src="/assets/create/afterCreatePost.png" alt="add"> 
      <img src="/assets/create/viewPost.png" alt="add"> 
      <img src="/assets/create/viewPost.png" alt="add"> 
  </div>

#### When Delete Author, the Post is Also Deleted

```js
app.delete("/users/:id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }).then((result) => {
    res.redirect("/users");
  });
});

// SCHEMA USER.JS
// LINK POST MIDDLEWARE -  MONGOOSE
// https://mongoosejs.com/docs/middleware.html#post
userSchema.post("findOneAndDelete", async function (users) {
  if (users.posts.length) {
    const res = await Post.deleteMany({ _id: { $in: users.posts } });
    console.log(res);
  }
});
```

##### Before

<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <img src="/assets/delete/beforeDelete.png" alt="add">
      <img src="/assets/delete/beforeDeleteAuthor.png" alt="add">
  </div>

##### After

<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <img src="/assets/delete/afterDelete.png" alt="add">
  </div>
