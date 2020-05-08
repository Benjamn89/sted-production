import React, { Component } from "react";
import { connect } from "react-redux";
import actionTypes from "../../../REDUCERS/03-PROFILE-PGAE/actionTypes";
import "./my-profile.css";

import TimeChecking from "../../FUNCTIONS/time-checking";
import ShowLikesBox from "../../FUNCTIONS/showLikes";

import Info from "./00-INFO/info";
import SinglePost from "../02-HOME-PAGE/POSTS-BOXES/single-post";
import UserProfile from "../../FUNCTIONS/userProfile";
import Friends from "../../FUNCTIONS/friends";
//Import Media
import Unlike from "../../../media/heart-unlike.png";
import Like from "../../../media/heart-like.png";
import Comment from "../../../media/comments.png";
import Delete from "../../../media/delete.png";

var index;

class MyProfile extends Component {
  componentDidMount() {}

  activeBtn = (e) => {
    if (e.target.className === "my-pro-p") {
      document.querySelector(".my-pro-view-div").classList.add("showSpinner");

      var visitPost = false;

      const thisState = this.props.profilePageState;

      document
        .querySelector(".active-btn-span")
        .classList.remove("active-btn-span");

      e.target.parentNode.children[1].classList.add("active-btn-span");

      if (thisState.wasFetched) {
        visitPost = true;
      }

      const objPro = {
        sectionName: e.target.innerHTML,
        email: this.props.profileBoxState.email,
        visitPost,
      };
      this.props.actionChangeMode(objPro);
    }
  };

  likeClick = (e) => {
    const index = e.target.getAttribute("index");

    var posts = JSON.parse(
      JSON.stringify(this.props.profilePageState.userPosts)
    );

    const email = this.props.profileBoxState.email;

    var checkLike = posts[index].likes.find((el) => {
      return el.email === email;
    });

    if (checkLike) {
      var filterArray = posts[index].likes.filter((fl) => {
        return fl.email !== email;
      });

      posts[index].likes = filterArray;
    } else {
      var obj = {
        email,
        fullName: this.props.profileBoxState.fullName,
        ref: this.props.loginRef,
      };

      posts[index].likes.push(obj);
    }

    const objPro = {
      ref: posts[index].ref,
      posts,
      index,
    };

    this.props.updateLikeAction(objPro);
  };

  clickComment = (e) => {
    const index = e.target.getAttribute("index");

    const ref = this.props.profilePageState.userPosts[index].ref;

    this.props.history.push(`/comment/${ref}`);
  };

  openDeleteDialog = (e) => {
    document.querySelectorAll(".delete-modal-div")[1].style.display = "flex";

    document.querySelectorAll(".delete-modal-div")[1].focus();

    index = e.target.getAttribute("index");
  };

  exitDeleteModal = (e) => {
    if (
      e.key === "Escape" ||
      e.target.innerHTML === "Cancel" ||
      e.target.className === "delete-modal-div"
    ) {
      document.querySelectorAll(".delete-modal-div")[1].style.display = "none";
    }
  };

  deletePost = (e) => {
    document
      .querySelectorAll(".delete-modal-inside-div")[1]
      .classList.add("deleteCommentSpinner");

    var ref = this.props.profilePageState.userPosts[index].ref;

    var posts = JSON.parse(
      JSON.stringify(this.props.profilePageState.userPosts)
    );

    posts.splice(index, 1);

    const opjPro = {
      ref,
      posts,
    };

    this.props.deletePostAction(opjPro);
  };

  history = () => {
    this.props.resetState();
    this.props.history.goBack();
  };

  moveToUser = (e) => {
    if (e.target.className === "friends-btn friends-btn-hover") {
      const ref = this.props.profileBoxState.friends[
        e.target.getAttribute("index")
      ].ref;

      this.props.resetState();
      this.props.history.push(`users/${ref}`);
      return null;
    }

    const likeIndex = e.target.getAttribute("index");

    const postIndex = e.target.parentNode.parentNode.children[0].getAttribute(
      "index"
    );

    const ref = this.props.profilePageState.userPosts[postIndex].likes[
      likeIndex
    ].ref;

    if (ref === this.props.loginRef) {
      return null;
    }

    this.props.resetState();
    this.props.history.push(`users/${ref}`);
  };

  removeFriendBtn = (e) => {
    e.target.classList.add("friendsSpinner");
    const index = e.target.getAttribute("index");
    const profileBoxShort = this.props.profileBoxState;
    const loginRef = profileBoxShort.refToProDoc;
    var copyFriendsArr = JSON.parse(JSON.stringify(profileBoxShort.friends));
    copyFriendsArr.splice(index, 1);
    const obj = {
      loginRef,
      copyFriendsArr,
      index,
    };
    this.props.removeFriendsFromProfile(obj);
  };

  render() {
    var currentSection;

    var thisState = this.props.profilePageState;

    if (thisState.currentSection === "Info") {
      currentSection = <Info />;
    }
    if (thisState.currentSection === "Posts") {
      if (thisState.userPosts.length > 0) {
        currentSection = thisState.userPosts.map((el, ind) => {
          var time = TimeChecking(el.postedTime, "Right Now...");

          var checkLikes = el.likes.find((el) => {
            return el.email === this.props.profileBoxState.email;
          });

          var whoLikes = el.likes.map((user, userInd) => {
            return (
              <p key={userInd} onClick={this.moveToUser} index={userInd}>
                {userInd + 1}. {user.fullName}
              </p>
            );
          });

          return (
            <SinglePost
              key={ind}
              imageUrl={el.imageUrl}
              fullName={el.fullName}
              displayTime={time}
              text={el.text}
              likeClick={this.likeClick}
              likeIcon={checkLikes ? Like : Unlike}
              index={ind}
              likesLength={el.likes.length}
              clickComment={this.clickComment}
              commentsImage={Comment}
              commentsLength={el.comments.length}
              whoLikes={whoLikes}
              showLikes={ShowLikesBox}
            >
              <div
                className="post-delete-div"
                onClick={this.openDeleteDialog}
                index={ind}
              >
                <img className="post-delete-btn" src={Delete} alt="deletebtn" />
              </div>
            </SinglePost>
          );
        });

        currentSection.reverse();
      } else {
        currentSection = (
          <div className="no-post-profile-div">
            <h1>There are no posts to show</h1>
          </div>
        );
      }
    }
    if (thisState.currentSection === "Friends") {
      if (this.props.profileBoxState.friends.length < 1) {
        currentSection = <h1 className="no-friends-to-show">No Friends</h1>;
      } else {
        currentSection = this.props.profileBoxState.friends.map((el, ind) => {
          return (
            <Friends
              imgUrl={el.image}
              fullName={el.fullName}
              key={ind}
              moveToUser={this.moveToUser}
              index={ind}
              removeFriends={true}
              removeFriendBtn={this.removeFriendBtn}
            />
          );
        });
      }
    }

    return (
      <UserProfile
        fullName={this.props.profileBoxState.fullName}
        history={this.history}
        currentSection={currentSection}
        activeBtn={this.activeBtn}
        deletePost={this.deletePost}
        exitDeleteModal={this.exitDeleteModal}
        friends={true}
        userExists={true}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profileBoxState: state.ProfileBoxReducer,
    profilePageState: state.ProfilePageReducer,
    loginRef: state.PostsReducer.ref,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actionChangeMode: (pro) => dispatch(actionTypes.actionChangeMode(pro)),
    resetState: () => dispatch(actionTypes.resetState()),
    updateLikeAction: (pro) => dispatch(actionTypes.updateLikeAction(pro)),
    deletePostAction: (pro) => dispatch(actionTypes.deletePostAction(pro)),
    removeFriendsFromProfile: (pro) =>
      dispatch(actionTypes.removeFriendsFromProfile(pro)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
