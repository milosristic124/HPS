import Firebase from 'firebase';

const configurationOptions = {
  apiKey: 'AIzaSyA7ip8bcJ2CJIJDwnypDtAYeFqhA_i8awY',
  authDomain: 'housepointsystem.firebaseapp.com',
  databaseURL: 'https://housepointsystem.firebaseio.com',
  projectId: 'housepointsystem',
  storageBucket: 'housepointsystem.appspot.com',
  messagingSenderId: '337749473587',
};

const firebase = Firebase.initializeApp(configurationOptions);
export default firebase;
