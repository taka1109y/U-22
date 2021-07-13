/* ------------------------------
    Loading イメージ表示関数
    引数： msg 画面に表示する文言
------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    let msg = "処理中です。";
    // 画面表示メッセージ
    var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
    // ローディング画像が表示されていない場合のみ出力
    if($("#loading").length == 0){
        $("body").append("<div id='loading'>" + dispMsg + "</div>");
    }
});

/* ------------------------------
Loading イメージ削除関数
------------------------------ */
function removeLoading(){
    $("#loading").remove();
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var email = user.email;
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

            document.querySelector('.name').innerHTML = "社員 : " + name;
            document.querySelector('.number').innerHTML = "社員番号 : " + number;

            getHealthData(number);
        }
    })
    .catch(error => {// 例外エラー発生時
        console.log(error.message);
    });
}

async function getHealthData(number) {
    const getHealthData = await firebase.functions().httpsCallable('getHealthData');
    getHealthData({
        number: number
    })
    .then((getHealthData) => {
        const data = getHealthData.data.healthData;

        const bodytemp = data.Bodytemp;
        const heartbeat = data.Heartbeat;
        const highBP = data.HighBP;
        const lowBP = data.LowBP;

        document.querySelector(".highBP").innerHTML = "最高:" + highBP + "mmHg";
        document.querySelector(".lowBP").innerHTML = "最低:" + lowBP + "mmHg";
        document.querySelector(".heartbeat").innerHTML = heartbeat + "拍 / 分";
        document.querySelector(".todayBodytemp").innerHTML = "今日 :" + bodytemp +"℃";

        removeLoading();
    })
    .catch(error => {// 例外エラー発生時
        console.log(error.message);
    });
}
