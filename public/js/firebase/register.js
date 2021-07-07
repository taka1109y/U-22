// firebaseのモジュールの読み込み
const registerForm = document.querySelector('.register');

// ----------------------------下記コードは管理者用に組み込む----------------------------------
// 新規登録フォーム
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // フォームの値の取得
    const number = registerForm.number.value;
    const email = registerForm.email.value;
    const password = registerForm.pass.value;

    // firebase　auth　ユーザー新規登録
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {// 成功時
        console.log('auth registered', user);
    })
    .catch(error => {// 例外エラー発生時
        registerForm.querySelector('.error').textContent = error.message;
    });
    
    // firestore　ユーザー登録用APIの実行
    const addUser = firebase.functions().httpsCallable('addUser');
    addUser({// APIに社員番号とメールアドレスを送る
        number: number,
        email: email,
    })
    .then(user => {// 成功時
        console.log('firestore registered', user);
        registerForm.reset();

        // 登録時は自動認証する為、一旦ログアウトする
        firebase.auth().signOut().then(() => console.log('signed out'));
    })
    .catch(error => {// 例外エラー発生時
        registerForm.querySelector('.error').textContent = error.message;
    });

    
});