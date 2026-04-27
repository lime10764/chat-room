// 权限校验
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
  alert("你没有管理员权限！");
  location.href = "index.html";
}

// 数据读取
let users = JSON.parse(localStorage.getItem("users")) || [];
let messages = JSON.parse(localStorage.getItem("messages")) || [];

// 返回聊天
function backToChat() {
  location.href = "chat.html";
}

// 渲染用户列表
function renderUsers() {
  const box = document.getElementById("userList");
  box.innerHTML = "";

  // 排除管理员账号
  const normalUsers = users.filter(u => u.user !== "admin");

  if (normalUsers.length === 0) {
    box.innerHTML = "<p>暂无注册用户</p>";
    return;
  }

  normalUsers.forEach(u => {
    const div = document.createElement("div");
    div.className = "user-item";
    div.innerHTML = `
      <span>账号：${u.user}</span>
      <button class="danger" onclick="deleteUser('${u.user}')">删除用户</button>
    `;
    box.appendChild(div);
  });
}

// 删除用户
function deleteUser(username) {
  if (!confirm(`确定要删除用户 ${username} 吗？`)) return;
  users = users.filter(u => u.user !== username);
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
}

// 渲染聊天记录
function renderMessages() {
  const box = document.getElementById("msgList");
  box.innerHTML = "";

  if (messages.length === 0) {
    box.innerHTML = "<p>暂无聊天记录</p>";
    return;
  }

  messages.forEach((msg, index) => {
    const div = document.createElement("div");
    div.className = "msg-item";
    let content = "";
    if (msg.type === "text") {
      content = `[文字] ${msg.user}: ${msg.text}`;
    } else if (msg.type === "file") {
      content = `[文件] ${msg.user}: ${msg.name}`;
    }
    div.innerHTML = `
      <span>${content}</span>
      <button class="danger" onclick="deleteMessage(${index})">删除</button>
    `;
    box.appendChild(div);
  });
}

// 删除单条聊天记录
function deleteMessage(index) {
  if (!confirm("确定要删除这条消息吗？")) return;
  messages.splice(index, 1);
  localStorage.setItem("messages", JSON.stringify(messages));
  renderMessages();
  renderFiles();
}

// 清空所有聊天记录
function clearAllMessages() {
  if (!confirm("⚠️ 确定要清空所有聊天记录吗？此操作不可恢复！")) return;
  messages = [];
  localStorage.setItem("messages", JSON.stringify(messages));
  renderMessages();
  renderFiles();
}

// 渲染文件列表
function renderFiles() {
  const box = document.getElementById("fileList");
  box.innerHTML = "";

  const fileMsgs = messages.filter(m => m.type === "file");

  if (fileMsgs.length === 0) {
    box.innerHTML = "<p>暂无上传的文件</p>";
    return;
  }

  fileMsgs.forEach((msg, index) => {
    const div = document.createElement("div");
    div.className = "file-item";
    let typeLabel = "文件";
    if (msg.fileType?.startsWith("image/")) typeLabel = "图片";
    if (msg.fileType?.startsWith("video/")) typeLabel = "视频";

    div.innerHTML = `
      <span>[${typeLabel}] ${msg.user}: ${msg.name}</span>
      <button class="danger" onclick="deleteFile(${messages.indexOf(msg)})">删除</button>
    `;
    box.appendChild(div);
  });
}

// 页面加载时初始化
window.onload = () => {
  renderUsers();
  renderMessages();
  renderFiles();
};
