import firebase from "firebase"



const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyAGzMC6xgPG_C_tsv7QSrQJzRi0FS9KLOY",
    authDomain: "instagram-clone-react-8f7f1.firebaseapp.com",
    projectId: "instagram-clone-react-8f7f1",
    storageBucket: "instagram-clone-react-8f7f1.appspot.com",
    messagingSenderId: "552963247166",
    appId: "1:552963247166:web:5a1c8a43d7c214e735956f"
  })
const db=firebaseApp.firestore()
const auth =firebase.auth()
const storage=firebase.storage()

export {db,auth,storage}

  export default db