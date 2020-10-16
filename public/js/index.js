document.addEventListener("DOMContentLoaded", () => {
  // DOMのリロードが終わったタイミングで認証開始
  auth();
});

function auth() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      activeMessages(user);
    })
    .catch(function (error) {
      alert("アカウント連携に失敗しました");
      console.log({ error });
    });
}

function activeMessages(user) {
  // メッセージ送信イベント登録
  const messageTextInput = document.querySelector("#message-text");
  const messageButton = document.querySelector("#message-submit-button");
  messageButton.addEventListener("click", () => {
    messagesDb.push({
      userId: user.uid,
      userDisplayName: user.displayName,
      userPhotoURL: user.photoURL,
      date: new Date().getTime(), // タイムスタンプをセット (例：1602862031298)
      text: messageTextInput.value,
    });
    messageTextInput.value = "";
  });
  
  // データベース
  const messagesDb = firebase.database().ref("messages");
  // realtime database 初期取得,更新イベント
  messagesDb.on("value", renderMessages);
}

function renderMessages(snapshot) {
  const messagesElm = document.querySelector("#chat-messages");
  const newMessages = [];
  // データ取得＆組み立て
  snapshot.forEach((message) => {
    newMessages.push(`
      <div class="chat-message-you">
        <div class="chat-message__text">
          <div class="chat-message__text-message">
            ${escapeHTML(message.val().text)}
          </div>
          <div class="chat-message__text-date">
            ${escapeHTML(formatDate(new Date(message.val().date)))}
          </div>
        </div>
      </div>
    `);
  });
  // viewに反映
  messagesElm.innerHTML = `
    <div>
      ${newMessages.join("")}
    </div>
  `;
  // スクロール最下部へ
  messagesElm.scrollTop = messagesElm.scrollHeight;
}