import express from "express";
import path from "path";
import fs from "fs";

const sv = express();
sv.use(express.urlencoded({ extended: true }));
sv.use(express.json());
function getusers() {
  return JSON.parse(fs.readFileSync("users.json", "utf-8"));
}
function setusers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

sv.use(express.urlencoded({ extended: true }));

sv.use(express.static("."));

sv.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

sv.get("/home", (req, res) => {
  res.sendFile(path.resolve("./pages/home.html"));
});

sv.get("/products", (req, res) => {
  res.sendFile(path.resolve("./pages/products.html"));
});

sv.get("/cart", (req, res) => {
  res.sendFile(path.resolve("./pages/cart.html"));
});

sv.get("/login", (req, res) => {
  res.sendFile(path.resolve("./pages/login.html"));
});

sv.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Email and Password are required");
  }

  const users = getusers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.redirect("/login?error=Incorrectpassword");
  }

  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  res.redirect("/");
});
sv.get("/register", (req, res) => {
  res.sendFile(path.resolve("./pages/register.html"));
});
sv.post("/register", (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  const users = getusers();
  if (password !== confirmPassword) {
    return res.send("Password Doesn't Match");
  }
  const existingUsers = (user) => user.email === email;
  if (!existingUsers) {
    return res.send("Account Already Exist");
  }
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    phone,
  };
  users.push(newUser)
  setusers(users)
  res.redirect("/login")
});

sv.listen(8080, () => {
  console.log("Server up on http://localhost:8080");
});
