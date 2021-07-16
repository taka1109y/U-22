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
    引数： data ログイン情報(number:社員番号)
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


/* ------------------------------
    authログイン情報からバイタル情報の取得
    引数： data フォームの入力値(number:社員番号)
 ------------------------------ */
exports.getHealthData = functions.https.onCall(async(data) => {
    const number = data.number;
    const helthData = {};
    const ref = db.collection("health");

    return new Promise(function(resolve, reject) {
        ref.where("number", "==", number).get()
        .then(function(snapshot){
            snapshot.forEach(function(doc) {
                helthData["healthData"] = doc.data();
            })
            resolve(helthData);
        })
        .catch((error) => {
            console.log(error.message);
            reject();
        })
    })
})



// 下記プログラムはテスト中、まだ動きません
/* ------------------------------
    顔認証からのデータをFirestoreへ保存するAPI
    引数： req AIの実行結果の配列
 ------------------------------ */
exports.python = functions.https.onRequest((req, res) => {
    // CORSの
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.set('Access-Control-Allow-Credentials', true);
    
    // リクエストのメソット確認
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    if (!req.body || !req.body.title) {
        res.status(400).send('Request Body Not Found');
        return;
    }
    
    // reqの配列を代入
    const memo = {
        'title': req.body.title,
        'description': req.body.description || 'unknown',
        'platforms': req.body.platforms || [],
        'million': req.body.million || false,
        'releasedAt': req.body.releasedAt ? new Date(req.body.releasedAt) : new Date()
    };
    
    console.log(memo);
    
    // Firestoreへの登録
    return db
        .collection('test')
        .add(memo)
        .then(docRef => {
        docRef.get().then(snapshot => {
            if (snapshot.exists) {
                console.log('Document retrieved successfully.', snapshot.data());
            }
        });
        // 登録に成功したら200を返す
        res.status(200).send(docRef.id);
        })
        .catch(err => {
        console.error(err);
        // 登録に失敗したら500を返す
        res.status(500).send('Error adding document:', err)
    });
})

