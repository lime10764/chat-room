const FIREBASE_URL = "https://chat-room-18a1c-default-rtdb.asia-southeast1.firebasedatabase.app/";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

const ADMIN_USER = "admin";
const ADMIN_PWD = "admin123";

// 注册
function register() {
  let user = document.getElementById("reg-user").value.trim();
  let pwd = document.getElementById("reg-pwd").value.trim();

  if (!user || !pwd) {
    alert("请输入账号密码");
    return;
  }
  if (user === ADMIN_USER) {
    alert("不能使用此账号");
    return;
  }

  fetch(FIREBASE_URL + "users.json")
  .then(res => res.json())
  .then(all => {
    let users = all || {};
    let exist = Object.values(users).some(u => u.user === user);
    if (exist) {
      alert("账号已存在");
      return;
    }
    fetch(FIREBASE_URL + "users.json", {
      method: "POST",
      body: JSON.stringify({ user, pwd })
    }).then(() => {
      alert("注册成功！");
    });
  });
}

// 登录（已修复！）
function login() {
  let user = document.getElementById("login-user").value.trim();
  let pwd = document.getElementById("login-pwd").value.trim();

  if (!user || !pwd) {
    alert("请输入账号密码");
    return;
  }

  // 管理员登录
  if (user === ADMIN_USER && pwd === ADMIN_PWD) {
    currentUser = { user: ADMIN_USER, role: "admin" };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    location.href = "chat.html";
    return;
  }

  // 普通用户登录
  fetch(FIREBASE_URL + "users.json")
  .then(res => res.json())
  .then(all => {
    let users = all || {};
    let found = Object.values(users).find(u => u.user === user && u.pwd === pwd);
    if (!found) {
      alert("账号或密码错误");
      return;
    }
    currentUser = { user: found.user, role: "user" };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    location.href = "chat.html";
  });
}

// 退出
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}

// 管理员后台
function goAdmin() {
  location.href = "admin.html";
}
