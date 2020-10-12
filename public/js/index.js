document.addEventListener("DOMContentLoaded", function () {
  const messagesElm = document.querySelector("#chat-messages");
  const messagesDb = firebase.database().ref("messages");

  // realtime database 初期取得,更新イベント
  messagesDb.on("value", (snapshot) => {
    const newMessages = [];
    // データ取得＆組み立て
    snapshot.forEach((message) => {
      newMessages.push(`
        <div class="chat-message">
          <div class="chat-message__icon">
            <img src="https://pbs.twimg.com/profile_images/745626656165879810/bKtSlWlv_400x400.jpg" />
          </div>
          <div class="chat-message__text">
            <div class="chat-message__text-date">
              ${escapeHTML(formatDate(new Date(message.val().date)))}
            </div>
            <div class="chat-message__text-message">
              ${escapeHTML(message.val().text)}
            </div>
          </div>
        </div>
      `);
    });
    // viewに反映
    messagesElm.innerHTML = `
      ${newMessages.join("")}
    `;
    // スクロール最下部へ
    messagesElm.scrollTop = messagesElm.scrollHeight;
  });

  // メッセージ送信アクション
  const messageTextInput = document.querySelector("#message-text");
  const messageButton = document.querySelector("#message-submit-button");
  messageButton.addEventListener("click", () => {
    messagesDb.push({
      date: new Date().getTime(),
      text: messageTextInput.value,
    });
    messageTextInput.value = "";
  });
});