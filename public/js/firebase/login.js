//
// ログイン用JS
//

// 下記ローディング中のイメージ表示はローカル実行の時のみ
// 本番環境では削除する
/* ------------------------------
    Loading イメージ表示関数
    引数： msg 画面に表示する文言
------------------------------ */
function dispLoading(msg){
    // 引数なし（メッセージなし）を許容
    if( msg == undefined ){
        msg = "";
    }
    // 画面表示メッセージ
    var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
    // ローディング画像が表示されていない場合のみ出力
    if($("#loading").length == 0){
        $("body").append("<div id='loading'>" + dispMsg + "</div>");
    }
}

/* ------------------------------
Loading イメージ削除関数
------------------------------ */
function removeLoading(){
    $("#loading").remove();
}

// 非同期処理中のイメージ関数の読み込み（本番環境時）
// import dispLoading from "../loading";
// import removeLoading from "../loading";




// クラスの取得及び変数の定義
const loginForm = document.querySelector('.login');

/* ------------------------------
    ログインボタン押下時の処理
    引数： 
------------------------------ */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // フォームの値の取得
    const number = loginForm.number.value;
    const pass = loginForm.pass.value;

    // フォーム値の正規表現チェック
    if(number == ''){
        alert('社員番号を入力してください。');
        return;
    }else if(pass == '' ){
        alert('パスワードを入力したください。');
        return;
    }else{
        if(number.match(/[^0-9]+/)){
            alert('社員番号は半角数字で入力してください。');
            return;
        }else if(!pass.match(/^[A-Za-z0-9]*$/)){
            alert('パスワードは半角英数で入力してください。');
            return;
        }else{
            // 非同期処理中のイメージ表示関数
            dispLoading("ログイン中...");
            // 社員番号からメールアドレスを返すAPIを叩く
            async function apieExecion(number) {
                // getEmailの呼び出し
                const getEmail = await firebase.functions().httpsCallable('getEmail');
                getEmail({
                    number: number// APIに社員番号を送る
                })
                .then((getEmail) => {// 成功時
                    const email = getEmail.data.userEmail.email;
                    if(email != undefined){
                        console.log(email);// 成功時にメールアドレスを受け取る
                        login(email, pass);// ログインのauth関数の呼び出し
                    }
                })
                .catch(error => {// 例外エラー発生時
                    console.log(error.message);
                    loginForm.querySelector('.error').textContent = '社員番号またはパスワードがまちがっています。';
                    removeLoading();// 非同期処理中のイメージ削除関数
                });
            }
            // 上記関数の呼び出し
            apieExecion(number);
        }
    }
});


/* ------------------------------
    firebase authログイン用関数
    引数： email メールアドレス
    引数： pass パスワード
------------------------------ */
function login(email, pass) {
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(user => {// 成功時
        console.log('logged in', user);
        loginForm.reset();
        removeLoading();// 非同期処理中のイメージ削除関数
    })
    .catch(error => {// 例外エラー発生時
        console.log(error.message);
        loginForm.querySelector('.error').textContent = '社員番号またはパスワードがまちがっています。';
        removeLoading();// 非同期処理中のイメージ削除関数
    });
}


/* ------------------------------
    firebase auth認証状態チェック
    引数： user auth認証情報
------------------------------ */
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = 'info_emp.html';
    }  
});






