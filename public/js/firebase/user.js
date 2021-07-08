firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var email = user.email;
        console.log(email);
        getUserInfo(email);
    }
});

async function getUserInfo(email) {
    const getUserInfo = await firebase.functions().httpsCallable('getUserInfo');
    getUserInfo({
        email: email// APIにメールアドレス
    })
    .then((getUserInfo) => {// 成功時
        const name = getUserInfo.data.userInfo.name;
        const number = getUserInfo.data.userInfo.number;
        if(name != undefined || number != undefined){
            console.log(name);
            console.log(number);

            document.querySelector('.name').innerHTML = name;
            document.querySelector('.number').innerHTML = number;
        }
    })
    .catch(error => {// 例外エラー発生時
        console.log(error.message);
    });
}
