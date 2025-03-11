const baseUrl = "http://127.0.0.1:3000/";
bearerKey = localStorage.getItem("token");

const clientIo = io(baseUrl, { auth: { authorization: bearerKey } });
const button = document.getElementById("btn");

clientIo.on("connect", () => console.log("connection stablished"));

clientIo.on("socket_error", (message) => {
  window.alert(message);
});

clientIo.on("application_submitted", (obj) => {
  window.alert(obj);
});

clientIo.on("connect_error", (err) => {
  window.alert(err);
});

clientIo.on("send_message", { message: "hello", to: "userId" });

function sendMessage() {
  clientIo.emit("send_message", {
    message: "hello sss",
    to: "67cc4eebb5d8c392a51bc1f5",
  });
}

clientIo.on("message_sent", (data) => {
  button.innerText = data;
  setTimeout(() => {
    button.innerText = "Send message";
  }, 1000);
});

button.addEventListener("click", sendMessage);
