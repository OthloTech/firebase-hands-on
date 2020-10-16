document.addEventListener("DOMContentLoaded", () => {
  // DOMのリロードが終わったタイミングで認証開始
  auth();
});

function auth() {
  const provider = new firebase.auth.GoogleAuthProvider();
  // Google認証のポップアップ表示
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // 認証成功
      const user = result.user;
      enableMessages(user);
    })
    .catch(function (error) {
      // 認証失敗
      alert("アカウント連携に失敗しました");
      console.log({ error });
    });
}

function enableMessages(user) {
  const messagesDb = firebase.database().ref("messages");
  // アクセス時＆データベースが更新された際のイベント設定
  messagesDb.on("value", renderMessages(user));

  // メッセージ送信イベント登録
  const messageTextInput = document.querySelector("#message-text");
  const messageButton = document.querySelector("#message-submit-button");
  messageButton.addEventListener("click", () => {
    // 送信ボタンが押されたタイミングでDBに登録＆フォームの内容をリセット
    messagesDb.push({
      userId: user.uid,
      userDisplayName: user.displayName,
      userPhotoURL: user.photoURL,
      date: new Date().getTime(), // タイムスタンプをセット (例：1602862031298)
      text: messageTextInput.value,
    });
    messageTextInput.value = "";
  });
}

function renderMessages(user) {
  const messagesElm = document.querySelector("#chat-messages");
  // コールバック関数
  return (snapshot) => {
    const newMessages = [];
    // messageを一つずつ取得し、表示用HTMLを組み立て
    snapshot.forEach((message) => {
      if (user.uid === message.val().userId) {
        // メッセージの送信者が自分の場合
        newMessages.push(`
          <div class="chat-message-me">
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
      } else {
        newMessages.push(`
          <div class="chat-message-you">
            <div class="chat-message__icon">
              <img src="${escapeHTML(message.val().userPhotoURL)}" />
            </div>
            <div class="chat-message__text">
              <div class="chat-message__text-user-name">
                ${escapeHTML(message.val().userDisplayName)}
              </div>
              <div class="chat-message__text-message">
                ${escapeHTML(message.val().text)}
              </div>
              <div class="chat-message__text-date">
                ${escapeHTML(formatDate(new Date(message.val().date)))}
              </div>
            </div>
          </div>
        `);
      }
    });
    // メッセージ表示エリアに描画
    messagesElm.innerHTML = `
      <div>
        ${newMessages.join("")}
      </div>
    `;
    // スクロール最下部へ移動
    messagesElm.scrollTop = messagesElm.scrollHeight;
  }
}