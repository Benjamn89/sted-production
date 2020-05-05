import React, { Component } from "react";
import "./users.css";
import { connect } from "react-redux";
import actionTypes from "../../../REDUCERS/04-USERS/actionTypes";

import UserProfile from "../../FUNCTIONS/userProfile";
import ProfileBox from "../../FUNCTIONS/profile-box";
import SinglePost from "../02-HOME-PAGE/POSTS-BOXES/single-post";
import TimeChecking from "../../FUNCTIONS/time-checking";
import ShowLikesBox from "../../FUNCTIONS/showLikes";
import Friends from "../../FUNCTIONS/friends";

import Like from "../../../media/heart-like.png";
import Unlike from "../../../media/heart-unlike.png";
import Delete from "../../../media/delete.png";
import Comment from "../../../media/comments.png";

var index;

class Users extends Component {
  shouldComponentUpdate(nP, nS) {
    if (nP.thisState.allowR !== this.props.thisState.allowR) {
      return true;
    }
    if (this.props.match.params.user !== nP.match.params.user) {
      document
        .querySelector(".active-btn-span")
        .classList.remove("active-btn-span");

      document.querySelector(".m-p-b-s").classList.add("active-btn-span");

      this.props.fetchUserData(nP.match.params.user);
    }
    return false;
  }

  componentDidMount() {
    if (this.props.history.action === "PUSH") {
      this.props.fetchUserData(this.props.match.params.user);
    } else {
      this.props.fetchUserDirect(this.props.match.params.user);
    }
  }

  history = () => {
    this.props.resetStateUsers();
    this.props.history.push("/");
  };

  activeBtn = (e) => {
    const title = e.target.getAttribute("title");

    document
      .querySelector(".active-btn-span")
      .classList.remove("active-btn-span");

    e.target.parentNode.children[1].classList.add("active-btn-span");

    if (this.props.thisState.watched) {
      return this.props.changeSecWithNoFetch(title);
    }

    document.querySelector(".my-pro-view-div").classList.add("showSpinner");

    const email = this.props.thisState.profileUser.email;

    const objPro = {
      email,
      title,
    };

    this.props.fetchPostsFromUsers(objPro);
  };

  likeClick = (e) => {
    const index = e.target.getAttribute("index");

    var posts = JSON.parse(JSON.stringify(this.props.thisState.Posts));

    const email = this.props.thisState.loginUser.email;

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
        fullName: this.props.thisState.loginUser.fullName,
        ref: this.props.profileBox.refToProDoc,
      };

      posts[index].likes.push(obj);
    }

    const objPro = {
      ref: posts[index].ref,
      posts,
      index,
    };

    this.props.updateLikeUsersAction(objPro);
  };

  clickComment = (e) => {
    const index = e.target.getAttribute("index");

    const ref = this.props.thisState.Posts[index].ref;

    this.props.history.push(`/comment/${ref}`);

    this.props.resetStateUsers();
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

    var ref = this.props.thisState.Posts[index].ref;

    var posts = JSON.parse(JSON.stringify(this.props.thisState.Posts));

    posts.splice(index, 1);

    const opjPro = {
      ref,
      posts,
    };

    this.props.deletePostUsersAction(opjPro);
  };

  moveToUser = (e) => {
    if (e.target.className === "friends-btn friends-btn-hover") {
      const ref = this.props.thisState.profileUser.friends[
        e.target.getAttribute("index")
      ].ref;
      if (ref === this.props.loginRef) {
        return this.props.history.push("/profile");
      }
      this.props.history.push(`/users/${ref}`);
      return null;
    }

    const likeIndex = e.target.getAttribute("index");

    const postIndex = e.target.parentNode.parentNode.children[0].getAttribute(
      "index"
    );

    const ref = this.props.thisState.Posts[postIndex].likes[likeIndex].ref;

    if (ref === this.props.loginRef) {
      return this.props.history.push("/profile");
    }

    this.props.history.push(`/users/${ref}`);
  };

  addFriend = () => {
    document.querySelector(".no-friends-div").classList.add("showSpinner2");
    const profileBox = JSON.parse(
      JSON.stringify(this.props.thisState.profileUser)
    );

    var friendsArr = JSON.parse(
      JSON.stringify(this.props.thisState.loginUser.friends)
    );
    const objToPush = {
      email: profileBox.email,
      fullName: profileBox.fullName,
      ref: profileBox.ref,
      image: profileBox.profileImg,
    };
    friendsArr.push(objToPush);
    const obj = {
      friendsArr,
      ref: this.props.thisState.loginUser.ref,
    };

    this.props.updateFriendsUserAction(obj);
  };

  render() {
    const thisState = this.props.thisState;

    try {
      var fullName = this.props.thisState.profileUser.fullName;
    } catch {}

    var currentView;

    if (this.props.thisState.loginUser) {
      var checkFriends = this.props.thisState.loginUser.friends.find((el) => {
        return el.email === this.props.thisState.profileUser.email;
      });
    }

    if (thisState.currentView === "Info") {
      if (checkFriends) {
        const titlesToDisplay = {
          location: thisState.profileUser.location,
          website: thisState.profileUser.website,
          image: thisState.profileUser.profileImg,
        };

        var splitTime = thisState.profileUser.time.split(" ");
        var timeStamp = {
          year: splitTime[3],
          month: splitTime[1],
          day: splitTime[2],
        };
        currentView = (
          <ProfileBox
            locationText={titlesToDisplay.location}
            websiteText={titlesToDisplay.website}
            timeStampMonth={timeStamp.month}
            timeStampYear={timeStamp.year}
            profileUrl={titlesToDisplay.image}
          />
        );
      }
    }

    if (thisState.currentView === "Posts") {
      if (thisState.Posts.length > 0) {
        currentView = thisState.Posts.map((el, ind) => {
          var time = TimeChecking(el.postedTime, "Right Now...");

          var checkLikes = el.likes.find((el) => {
            return el.email === this.props.thisState.loginUser.email;
          });

          var whoLikes = el.likes.map((user, userInd) => {
            return (
              <p key={userInd} onClick={this.moveToUser} index={userInd}>
                {userInd + 1}. {user.fullName}
              </p>
            );
          });

          var deleteBtn;
          if (thisState.email === el.email) {
            deleteBtn = (
              <div
                className="post-delete-div"
                onClick={this.openDeleteDialog}
                index={ind}
              >
                <img className="post-delete-btn" src={Delete} alt="deletebtn" />
              </div>
            );
          }

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
              {deleteBtn}
            </SinglePost>
          );
        });

        currentView.reverse();
      } else {
        currentView = (
          <div className="no-post-profile-div">
            <h1>There are no posts to show</h1>
          </div>
        );
      }
    }
    if (thisState.currentView === "Friends") {
      if (thisState.profileUser.friends.length < 1) {
        currentView = <h1 className="no-friends-to-show">No Friends</h1>;
      } else {
        currentView = thisState.profileUser.friends.map((el, ind) => {
          return (
            <Friends
              imgUrl={el.image}
              fullName={el.fullName}
              index={ind}
              key={ind}
              moveToUser={this.moveToUser}
            />
          );
        });
      }
    }
    return (
      <UserProfile
        fullName={fullName}
        history={this.history}
        currentSection={currentView}
        activeBtn={this.activeBtn}
        exitDeleteModal={this.exitDeleteModal}
        deletePost={this.deletePost}
        friends={checkFriends}
        addFriend={this.addFriend}
        name={fullName}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    thisState: state.UsersReducer,
    profileBox: state.ProfileBoxReducer,
    loginRef: state.PostsReducer.ref,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetStateUsers: () => dispatch(actionTypes.resetStateUsers()),
    fetchUserData: (profileRef) =>
      dispatch(actionTypes.fetchUserData(profileRef)),
    fetchPostsFromUsers: (pro) =>
      dispatch(actionTypes.fetchPostsFromUsers(pro)),
    changeSecWithNoFetch: (title) =>
      dispatch(actionTypes.changeSecWithNoFetch(title)),
    updateLikeUsersAction: (pro) =>
      dispatch(actionTypes.updateLikeUsersAction(pro)),
    deletePostUsersAction: (pro) =>
      dispatch(actionTypes.deletePostUsersAction(pro)),
    updateFriendsUserAction: (obj) =>
      dispatch(actionTypes.updateFriendsUserAction(obj)),
    fetchUserDirect: (profileRef) =>
      dispatch(actionTypes.fetchUserDirect(profileRef)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
