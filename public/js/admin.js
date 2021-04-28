const socket = io();

let connectionsUsers = [];

socket.on("admin_list_all_users", connections => {
  connectionsUsers = connections;
  document.getElementById("list_users").innerHTML = "";

  console.log("connectionsUsers", connectionsUsers);

  let template = document.getElementById("template").innerHTML;

  connections.forEach(connection => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.userId
    })

    document.getElementById("list_users").innerHTML += rendered;
  });
});

function call(userId) {
  const connection = connectionsUsers.find(
    connection => connection.userId === userId);

  const { email } = connection.user;

  const template = document.getElementById("admin_template").innerHTML;
  const rendered = Mustache.render(template, {
    email,
    id: userId
  })

  document.getElementById("supports").innerHTML += rendered;

  const data = { userId };

  console.log("Open chat", data)
  socket.emit("admin_user_in_support", data);

  socket.emit("admin_list_messages_by_user", data, messages => {
    messages.forEach(message => {
      const { text, createdAt } = message;
      let createElem = null;

      if (message.adminId === null) {
        createElem = createElementChatMessage(
          "client", text, email, createdAt);
      } else {
        createElem = createElementChatMessage(
          "admin", text, null, createdAt);
      }

      addElemOnChat(userId, createElem);
    });
  })
}

function sendMessage(userId) {
  const text = document.getElementById(`send_message_${userId}`);

  const params = {
    text: text.value,
    userId
  }

  socket.emit("admin_send_message", params);

  const createElem = createElementChatMessage(
    "admin", text.value, null, null);

  addElemOnChat(userId, createElem);
  text.value = "";
}

socket.on("admin_receive_message", data => {
  const connection = connectionsUsers.find(
    connection => connection.socketId = data.socketId);

  const { id: userId, email } = connection.user;
  const { text, createdAt } = data.message;

  console.log("connection", connection)
  console.log("data", data)

  const createElem = createElementChatMessage(
    "client", text, email, createdAt);

  addElemOnChat(userId, createElem);
})

function createElementChatMessage(type, text, email, date) {
  date = date ? dayjs(date) : dayjs();

  const createDiv = document.createElement("div");
  const createdAt = date.format("DD/MM/YYYY HH:mm:ss")

  if (type === "admin") {
    createDiv.className = "admin_message_admin";
    createDiv.innerHTML = `Atentente: <span>${text}</span>`;
    createDiv.innerHTML += `<span class="admin_date">${createdAt}</span>`;

  } else if (type === "client") {
    createDiv.className = "admin_message_client";
    createDiv.innerHTML = `<span>${email}</span>`;
    createDiv.innerHTML = `<span>${text}</span>`;
    createDiv.innerHTML += `<span class="admin_date">${createdAt}</span>`;
  }

  return createDiv;
}

function addElemOnChat(userId, chatElem) {
  const divMessages = document.getElementById(`allMessages${userId}`);
  divMessages.appendChild(chatElem);
}