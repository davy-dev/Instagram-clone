import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import { db } from "./firebase";
import firebase from "firebase"


export default function Post({postId,commenter, username, caption,imageUrl}) {
  const [comments, setComments] = useState([]);
  const [comment,setComment]=useState("")
  
  useEffect(()=>{
   

    if(postId){
      db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp","desc")
        .onSnapshot((snapshot)=>{
          setComments(snapshot.docs.map((doc)=>doc.data()))
        })
    }
 
  },[postId])

  const postComment= (e)=>{
    e.preventDefault()
    db
    .collection("posts")
    .doc(postId)
    .collection("comments").add({
      text:comment,
      username:commenter,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment("")
  }



  return (
    <div className="Post">
      <div className="post-header">
        <Avatar
          className="post-avatar"
          alt="Dav-dev"
          src="https://www.wallpaperbetter.com/wallpaper/900/332/902/knowing-burning-earth-720P-wallpaper-thumb.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post-image" src={imageUrl} alt="imagepost" />

      <h4 className="post-text">
        <strong>{username}:</strong>
        {caption}
      </h4>
     {comments.map((com,id)=>(
       <h4 key={id} className="post-comments"><strong>{com.username}: </strong>{com.text}</h4>
     ))}

     {commenter && (   <form className="post-commentBox">
        <input
        className="post-input"
          placeholder="Ajouter un commentaire..."
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="post-button"  type="submit" onClick={postComment} >
          Post
        </button>
        
      </form>)}
   
    </div>
  );
}
