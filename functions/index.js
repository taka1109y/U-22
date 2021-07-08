// firebaseのモジュールの読み込み
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");
admin.initializeApp();
const db = admin.firestore();


/* ------------------------------
    auth登録時にfirestoreにも登録するAPI
    引数： data フォームの入力値(number:社員番号)
    引数： data フォームの入力値(email:メールアドレス)
 ------------------------------ */
exports.addUser = functions.https.onCall((data) => {
    return db.collection("users").add({
        number: data.number,
        email: data.email,
    });
});


/* ------------------------------
    社員番号からメールアドレスを返すAPI
    引数： data フォームの入力値(number:社員番号)
 ------------------------------ */
exports.getEmail = functions.https.onCall(async(data) => {
    // フォームに入力された社員番号
    const number = data.number;
    // firestoreのテーブル保存用連想配列
    const email = {};
    // collectionの設定とget()の実行
    const ref = db.collection("users");// テーブルの指定

    return new Promise(function(resolve, reject) {
        ref.where("number", "==", number).select("email").get()
        .then(function(snapshot){// 成功時の処理
            snapshot.forEach(function(doc) {
                email["userEmail"] = doc.data();
            })
            resolve(email);// メールアドレスの返却
        })
        .catch((error) => {// 例外エラー発生時
            console.log(error.message);
            reject();
        });
    });
});


/* ------------------------------
    authログイン情報から社員名と社員番号の抽出
    引数： data フォームの入力値(number:社員番号)
 ------------------------------ */
exports.getUserInfo = functions.https.onCall(async(data) => {
    const email = data.email;
    const userInfo = {};
    const ref = db.collection("users");

    return new Promise(function(resolve, reject) {
        ref.where("email", "==", email).select("name", "number").get()
        .then(function(snapshot){
            snapshot.forEach(function(doc) {
                userInfo["userInfo"] = doc.data();
            })
            resolve(userInfo);
        })
        .catch((error) => {
            console.log(error.message);
            reject();
        });
    });
});