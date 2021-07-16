//今日の日付データを変数hidukeに格納
var hiduke = new Date();

//年・月・日・曜日を取得する
var year = hiduke.getFullYear();
var month = hiduke.getMonth() + 1;
var day = hiduke.getDate();

today = document.getElementById("today");
// 今日の日付を表示
today.textContent =
  year.toString() + "年" + month.toString() + "月" + day.toString() + "日 現在";

// 絞り込みボタン読み込み
narrow_btn = document.getElementById("narrow_btn");

//モーダルの要素を読み込み
modal = document.getElementById("modal");

//絞り込みボタンにイベントを追加
narrow_btn.addEventListener("click", showModal);

//モーダル表示用関数
function showModal() {
  console.log("モーダル表示中");
  modal.classList.remove("invisible");
}

batsu_btn = document.getElementById("batsu");

batsu_btn.addEventListener("click", hideModal);

//モーダル非表示用関数
function hideModal() {
  console.log("モーダル非表示中");
  modal.classList.add("invisible");
}

//表示順ボタン
order_left_btn = document.getElementById("order_left_btn");
order_right_btn = document.getElementById("order_right_btn");

//チェック切り替え用変数
//0: 50音順 1:入社順
var order_btn_flag = 0;

order_left_btn.addEventListener("click", function () {
  order_btn_flag = 0;
  order_left_btn.innerHTML = "&#10003;50音順";
  order_right_btn.innerHTML = "入社順";
});

order_right_btn.addEventListener("click", function () {
  order_btn_flag = 1;
  order_left_btn.innerHTML = "50音順";
  order_right_btn.innerHTML = "&#10003;入社順";
});

// モーダル内の展開ボタン
arrow_btn = document.getElementById("arrow");

//アコーディオンメニュー要素全体
accordion = document.getElementById("accordion");

arrow_btn.addEventListener("click", () => {
  console.log("アコーディオンメニューを開きました");
});
