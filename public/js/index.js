// ----- グローバル変数 ----- //
let usersList = []; // ユーザ一覧

// ----- 認証の呼び出し箇所 ----- //
document.addEventListener("DOMContentLoaded", () => {
    // DOMのリロードが終わったタイミングで認証開始
    auth();
});

// ----- 認証処理作成箇所 ----- //
function auth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // Google認証のポップアップ表示
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log({result});
            updateUserinfo(result.user);

            // 新規コード追加部分
            enableMessages(result.user);
        })
        .catch(function (error) {
            // 認証失敗
            alert("アカウント連携に失敗しました");
            console.log({error});
        });
}

// ----- ユーザ情報登録/更新処理 ----- //
function updateUserinfo(user) {
    const userDb = firebase.database().ref("users/" + user.uid);

    userDb.set({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
    });

    // 新規コード追加部分
    const usersDb = firebase.database().ref("users");
    console.log(usersDb);
    usersDb.on("value", renderUserslist(user));
}

// ----- ユーザ一覧表示処理 ----- //
function renderUserslist(user) {
    const usersElm = document.querySelector("#users_list");

    // コールバック関数
    return (snapshot) => {
        const newUsers = [];

        usersList = snapshot.val();

        // 自身を追加
        newUsers.push(`
          <div class="users_list__box-me">
            <div class="users_list__icon">
              <img src="${escapeHTML(user.photoURL)}" />
            </div><div class="users_list__status">
              <p class="users_list__name">${escapeHTML(user.displayName)}</p>
            </div>
          </div>
        `);

        // ユーザ情報を一つずつ取得し、表示用HTMLを組み立て
        snapshot.forEach((send_user) => {
            // 自分以外のユーザのみ追加
            if (user.uid !== send_user.val().uid) {
                newUsers.push(`
          <div class="users_list__box">
            <div class="users_list__icon">
              <img src="${escapeHTML(send_user.val().photoURL)}" />
            </div><div class="users_list__status">
              <p class="users_list__name">${escapeHTML(send_user.val().displayName)}</p>
            </div>
          </div>
        `);
            }
        });
        // ユーザ一覧表示エリアに描画
        usersElm.innerHTML = `
      <div>
        ${newUsers.join("")}
      </div>
    `;
        // スクロール最下部へ移動
        usersElm.scrollTop = usersElm.scrollHeight;
    }
}

// ----- メッセージ送信処理箇所 ----- //
function enableMessages(user) {
    const messagesDb = firebase.database().ref("messages");

    // アクセス時＆データベースが更新された際のイベント設定
    messagesDb.on("value", renderMessages(user));

    // メッセージ送信イベント登録
    const messageTextInput = document.querySelector("#message-text");
    const messageButton = document.querySelector("#message-submit-button");

    // 送信ボタンが押された場合
    messageButton.addEventListener("click", () => {
        // DBへ新規メッセージの登録
        messagesDb.push({
            userId: user.uid,
            date: new Date().getTime(), // タイムスタンプをセット (例：1602862031298)
            text: messageTextInput.value,
        });
        // フォームの内容をリセット
        messageTextInput.value = "";
    });
}

// ----- メッセージ表示処理箇所 ----- //
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
                // 自分以外が送信したメッセージの場合
                newMessages.push(`
          <div class="chat-message-you">
            <div class="chat-message__icon">
              <img src="${escapeHTML(usersList[message.val().userId].photoURL)}" />
            </div>
            <div class="chat-message__text">
              <div class="chat-message__text-user-name">
                ${escapeHTML(usersList[message.val().userId].displayName)}
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