const FIREBASE_URL = "https://chat-room-18a1c-default-rtdb.asia-southeast1.firebasedatabase.app/";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
const ADMIN_USER = "admin";
const ADMIN_PWD = "admin123";

// 注册
function register() {
  const user = document.getElementById("reg-user").value.trim();
  const pwd = document.getElementById("reg-pwd").value.trim();
  if (!user || !pwd) return alert("请输入账号密码");
  if (user === ADMIN_USER) return alert("系统保留账号");

  fetch(FIREBASE_URL + "users.json")
    .then(res => res.json())
    .then(users => {
      if (users && Object.values(users).some(u => u.user === user)) {
        alert("账号已存在");
        return;
      }
      fetch(FIREBASE_URL + "users.json", {
        method: "POST",
        body: JSON.stringify({ user, pwd })
      }).then(() => alert("注册成功！"));
    });
}

// 登录
function login() {
  const user = document.getElementById("login-user").value.trim();
  const pwd = document.getElementById("login-pwd").value.trim();
  if (!user || !pwd) return alert("请输入账号密码");

  if (user === ADMIN_USER && pwd === ADMIN_PWD) {
    currentUser = { user: ADMIN_USER, role: "admin" };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    location.href = "chat.html";
    return;
  }

  fetch(FIREBASE_URL + "users.json")
    .then(res => res.json())
    .then(users => {
      const found = Object.values(users || {}).find(
        u => u.user === user && u.pwd === pwd
      );
      if (!found) return alert("账号或密码错误");
      currentUser = { user: found.user, role: "user" };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      location.href = "chat.html";
    });
}

// 退出登录
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}

// 进入管理员后台
function goAdmin() {
  location.href = "admin.html";
}
