import React, { useEffect, useState } from "react";
import "./Post.css";
import { db } from "./firebase";
import firebase from "firebase";
import Modal from "@material-ui/core/Modal"
import {makeStyles} from "@material-ui/core/styles"
import { Avatar } from "@material-ui/core";
import {AvatarGroup} from '@material-ui/lab';

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { pink } from "@material-ui/core/colors";


const useStyle= makeStyles((theme)=>({
   
    small:{
      width:theme.spacing(4),
      height:theme.spacing(4)
    },

    pink:{
      color:pink[500],
      marginLeft:7,
      marginBottom:7,
      marginTop:7
    },
    position:{
      marginLeft:7,
      marginBottom:7,
      marginTop:7
    }
 
  }
))




export default function Post({
  postId,
  user,
  username,
  caption,
  imageUrl,
  likes,
}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [actionLike, setActionLike] = useState(false);
  const [openLikersList,setOpenLikersList]=useState(false)
  const classes=useStyle()
  


  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    if (likes.includes(user?.displayName)) {
      setActionLike(true);
    }
  }, []);

  const handleLike = () => {
    if (user) {
      if (likes.includes(user.displayName)) {
        db.collection("posts")
          .doc(postId)
          .update({
            likes: firebase.firestore.FieldValue.arrayRemove(user.displayName),
          });

        setActionLike(false);
      } else {
        db.collection("posts")
          .doc(postId)
          .update({
            likes: firebase.firestore.FieldValue.arrayUnion(user.displayName),
          });

        setActionLike(true);
      }
    }
  };

  const handleLikersList=()=>{

    if(openLikersList){
      setOpenLikersList(false)
    }else{
      setOpenLikersList(true)
    }

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

      <div className="post-likes">
        
        {actionLike === true ? (
          <FavoriteIcon className={classes.pink} onClick={handleLike} />
        ) : (
          <FavoriteBorderIcon className={classes.position} onClick={handleLike} />
        )}
        {<span>{likes.length}</span>}

        <AvatarGroup onClick={handleLikersList}  max={3}>
          {likes.map((liker,id)=>(
            <Avatar className={classes.small} alt={liker} key={id}/>
          ))}
    
        </AvatarGroup>
        <div className="post-likesModal" style={openLikersList?{display:"block"}:{display:"none"}} onClick={()=>setOpenLikersList(false)}>
            <ul className="post-likesList"  onClick={ ()=>setOpenLikersList(false)}>
             {likes.map(liker=>(
             <li style={{display:"flex",margin:"7px"}}><Avatar/> <span>{liker}</span></li>
             ))}
           </ul> 
        </div>
    
      </div>

      <h4 className="post-text">
        <strong>{username}:</strong>
        {caption}
      </h4>
      {comments.map((com, id) => (
        <h4 key={id} className="post-comments">
          <strong>{com.username}: </strong>
          {com.text}
        </h4>
      ))}

      {user && (
        <form className="post-commentBox">
          <input
            className="post-input"
            placeholder="Ajouter un commentaire..."
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="post-button" type="submit" onClick={postComment}>
            Post
          </button>
        </form>
      )}
    </div>
  );
}
