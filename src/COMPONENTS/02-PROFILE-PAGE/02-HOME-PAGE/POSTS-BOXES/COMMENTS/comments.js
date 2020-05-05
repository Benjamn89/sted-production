import React, { Component } from "react";
import "./comments.css";

import Input from "./inputStyle";

import TimeChecking from "../../../../FUNCTIONS/time-checking";
import ShowLikes from "../../../../FUNCTIONS/show-likes-comments";

import CommentIcon from "../../../../../media/comments.png";
import LikeIcon from "../../../../../media/heart-like.png";
import UnlikeIcno from "../../../../../media/heart-unlike.png";
import Delete from "../../../../../media/delete.png";

import { connect } from "react-redux";
import actionTypes from "../../../../../REDUCERS/02-HOME-PAGE/02-COMMENTS/actionTypes";

class Comments extends Component {
  state = {
    render: false,
  };

  shouldComponentUpdate(nP, nS) {
    var thisProps = this.props.commentsReducer;
    if (
      nP.commentsReducer.getPost !== thisProps.getPost ||
      nP.commentsReducer.updatedPost !== thisProps.updatedPost
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    document.querySelector(".comments-div").classList.add("createPostSpinner");

    document.querySelector(".comments-div").focus();

    const ref = this.props.match.params.user;

    this.props.getPostAction(ref);
  }

  goBack = (e) => {
    if (e.type === "keydown" && e.key === "Escape") {
      document.body.style.overflow = "";
      this.props.history.goBack();
    }
    if (e.type === "click") {
      if (e.target.className === "comments-div" || e.target.innerHTML === "+") {
        document.body.style.overflow = "";
        this.props.history.goBack();
      }
    }
  };

  createComment = () => {
    const inputValue = document.querySelector("#outlined-basic").value;

    if (inputValue.length > 1) {
      document.querySelector(".com-ins3-btn").classList.add("showSpinner");

      var profileBox = this.props.profileBox;

      const now = new Date();
      const postedTime = now.getTime();

      const copyPost = JSON.parse(
        JSON.stringify(this.props.commentsReducer.copyPost)
      );

      const theComment = {
        body: inputValue,
        profileImg: profileBox.url,
        email: profileBox.email,
        fullName: profileBox.fullName,
        postedTime,
        displayTime: "Right now...",
        ref: this.props.profileBox.refToProDoc,
      };

      const postRef = this.props.commentsReducer.postRef;

      copyPost.comments.push(theComment);

      const proObj = {
        inputValue,
        postRef,
        copyPost,
      };

      this.props.postComment(proObj);
    }
  };

  likeClick = () => {
    var commentsReducer = this.props.commentsReducer;

    const email = this.props.profileBox.email;

    var copyLikesPost = JSON.parse(
      JSON.stringify(commentsReducer.copyPost.likes)
    );

    const ref = commentsReducer.postRef;

    var validateEmail = copyLikesPost.find((el) => {
      return el.email === email;
    });

    if (validateEmail) {
      var filterArray = copyLikesPost.filter((fl) => {
        return fl.email !== email;
      });

      copyLikesPost = filterArray;
    } else {
      const fullName = this.props.profileBox.fullName;

      const obj = {
        email,
        fullName,
      };

      copyLikesPost.push(obj);
    }

    const objPro = {
      likesArray: copyLikesPost,
      ref,
    };

    this.props.likeClick(objPro);
  };

  openDeleteDialog = (e) => {
    if (e.target.className === "post-delete-div") {
      e.target.children[1].classList.toggle("test-delete");
    } else {
      document
        .querySelector(".comments-inside4-div")
        .classList.add("deleteCommentSpinner");

      var commentIndex = e.target.getAttribute("index");

      var commentsArray = JSON.parse(
        JSON.stringify(this.props.commentsReducer.copyPost.comments)
      );

      commentsArray.splice(commentIndex, 1);

      //Make an object to forward to actionTypes
      var objPro = {
        commentsArray,
        ref: this.props.commentsReducer.postRef,
      };

      this.props.deleteCommentRequest(objPro);
    }
  };

  moveToUser = (e) => {
    const eClass = e.target.className;
    const thisState = this.props.commentsReducer;
    var ref;
    if (eClass === "ins2-inside-h1") {
      ref = thisState.copyPost.userRef;
    } else if (eClass === "ins2-inside-h1 ins4-h1") {
      ref = thisState.copyPost.comments[e.target.getAttribute("index")].ref;
    } else if (eClass === "likes-comment-p") {
      ref = thisState.copyPost.likes[e.target.getAttribute("index")].ref;
    }

    if (ref === this.props.profileBox.refToProDoc) {
      return this.props.history.push("/profile");
    }
    this.props.history.push(`/users/${ref}`);
  };

  render() {
    if (this.props.commentsReducer.postRef) {
      var renderPost, commentsArray, renderComments, checkLikes, deleteIcon;
      var postRef = this.props.commentsReducer.copyPost;

      commentsArray = this.props.commentsReducer.copyPost.comments;
      //Render the comments with map
      if (commentsArray.length > 0) {
        renderComments = commentsArray.map((el, ind) => {
          var time = TimeChecking(el.postedTime, "Right Now...");

          if (el.email === this.props.profileBox.email) {
            deleteIcon = (
              <div
                className="post-delete-div"
                onClick={this.openDeleteDialog}
                index={ind}
              >
                <img className="post-delete-btn" src={Delete} alt="deletebtn" />
                <div index={ind} className="popup-delete">
                  You Sure?
                </div>
              </div>
            );
          } else {
            deleteIcon = null;
          }

          return (
            <div className="comments-inside4-div" key={ind}>
              {deleteIcon}
              <img src={el.profileImg} alt="testImg" />
              <div className="com-ins4-inside">
                <h1
                  className="ins2-inside-h1 ins4-h1"
                  index={ind}
                  onClick={this.moveToUser}
                >
                  {el.fullName}
                </h1>
                <p className="ins2-inside-time">{time}</p>
                <p className="ins2-inside-body ins4-body">{el.body}</p>
              </div>
            </div>
          );
        });

        renderComments.reverse();
      }

      checkLikes = postRef.likes.find((el) => {
        return el.email === this.props.profileBox.email;
      });

      var postTime = TimeChecking(postRef.postedTime, "value");

      var likesNames = postRef.likes.map((user, userInd) => {
        return (
          <p
            key={userInd}
            className="likes-comment-p"
            index={userInd}
            onClick={this.moveToUser}
          >
            {userInd + 1}. {user.fullName}
          </p>
        );
      });

      renderPost = (
        <div className="comments-inside-div">
          <div className="comments-inside2-div">
            <img
              className="com-ins2-img"
              src={postRef.imageUrl}
              alt="testImg"
            />
            <div className="com-ins2-inside">
              <div className="wrap-x-button">
                <span className="x-button">+</span>
              </div>
              <h1 className="ins2-inside-h1" onClick={this.moveToUser}>
                {postRef.fullName}
              </h1>
              <p className="ins2-inside-time">{postTime}</p>
              <p className="ins2-inside-body">{postRef.text}</p>
              <div>
                <div className="com-wrap-icon c-w-i-div">
                  <img
                    onClick={this.likeClick}
                    className="com-wrap-icon-img c-w-i-i"
                    src={checkLikes ? LikeIcon : UnlikeIcno}
                    alt="com-unlike"
                  />
                  <div className="com-in-likes-box">{likesNames}</div>
                </div>
                <p className="com-ins2-icon-p" onClick={ShowLikes}>
                  {postRef.likes.length} Likes
                </p>
                <div className="com-wrap-icon">
                  <img
                    className="com-wrap-icon-img"
                    src={CommentIcon}
                    alt="com-com"
                  />
                </div>
                <p className="com-ins2-icon-p2">
                  {postRef.comments.length} Comments
                </p>
              </div>
            </div>
          </div>
          <div className="comments-inside3-div">
            <Input />
            <button onClick={this.createComment} className="com-ins3-btn">
              SUBMIT
            </button>
          </div>
          {renderComments}
        </div>
      );
    }

    return (
      <div
        className="comments-div"
        tabIndex="0"
        onKeyDown={this.goBack}
        onClick={this.goBack}
      >
        {renderPost}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commentsReducer: state.CommentsReducer,
    profileBox: state.ProfileBoxReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPostAction: (ref) => dispatch(actionTypes.getPostAction(ref)),
    postComment: (properties) => dispatch(actionTypes.postComment(properties)),
    likeClick: (properties) => dispatch(actionTypes.likeClick(properties)),
    deleteCommentRequest: (properties) =>
      dispatch(actionTypes.deleteCommentRequest(properties)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
