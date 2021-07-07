// firebaseのモジュールの読み込み
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


/* ------------------------------
    auth登録時にfirestoreにも登録するAPI
    引数： data フォームの入力値(number:社員番号)
    引数： data フォームの入力値(email:メールアドレス)
 ------------------------------ */
exports.addUser = functions.region('asia-northeast1').https.onCall((data) => {
    return db.collection("users").add({
        number: data.number,
        email: data.email,
    });
});


/* ------------------------------
    社員番号からメールアドレスを返すAPI
    引数： data フォームの入力値(number:社員番号)
 ------------------------------ */
exports.getEmail = functions.region('asia-northeast1').https.onCall(async(data) => {
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
                email["userEmail"] = doc.data()
            })
            resolve(email);// メールアドレスの返却
        })
        .catch((err) => {// 例外エラー発生時
            console.log(err.message);
            reject();
        });
    });
});
