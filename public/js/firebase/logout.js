const signOut = document.querySelector('.sign-out');

// サインアウト
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
      .then(() => console.log('signed out'));
});

// auth認証状態がサインアウトしていたらログインページへ
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  }
});