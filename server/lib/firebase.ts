import firebase from 'firebase';


var config = {
    apiKey: "AIzaSyClydf1wJfNWf23-ZgtAQv6sRNc-U_WIY8",
    authDomain: "blogreactgraphql.firebaseapp.com",
    databaseURL: "https://blogreactgraphql.firebaseio.com",
    projectId: "blogreactgraphql",
    storageBucket: "blogreactgraphql.appspot.com",
    messagingSenderId: "803851454251"
};
const app = firebase.initializeApp(config);



export default app;