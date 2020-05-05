import React, { Component } from "react";
import DeleteModal from "../02-PROFILE-PAGE/02-HOME-PAGE/POSTS-BOXES/DELETE-MODAL/delete-modal";
import AddFriend from "./no-friends-msg";

const titles = ["Info", "Posts", "Friends"];

class UserProfile extends Component {
  componentDidMount() {
    document.querySelector(".my-profile-div").focus();
  }

  cancellProfile = (e) => {
    if (e.key && e.target.className === "my-profile-div") {
      if (e.key === "Escape") {
        this.props.history();
      }
    } else {
      if (e.target.className === "my-profile-div") {
        this.props.history();
      }
    }
  };

  render() {
    if (this.props.friends) {
      var titlesInfo = titles.map((title, ind) => {
        return (
          <div
            onClick={this.props.activeBtn}
            className="my-pro-btn-btn"
            key={ind}
          >
            <p title={title} className="my-pro-p">
              {title}
            </p>
            <span
              className={ind === 0 ? "m-p-b-s active-btn-span" : "m-p-b-s"}
              title={title}
            ></span>
          </div>
        );
      });

      return (
        <div
          className="my-profile-div"
          onClick={this.cancellProfile}
          onKeyDown={this.cancellProfile}
          tabIndex="0"
        >
          <DeleteModal
            delete={this.props.deletePost}
            cancel={this.props.exitDeleteModal}
          />
          <div className="my-profile-inside">
            <h1 className="my-pro-title">{this.props.fullName}</h1>
            <div className="my-pro-btn-div">{titlesInfo}</div>
            <div className="my-pro-view-div">{this.props.currentSection}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="my-profile-div"
          onClick={this.cancellProfile}
          onKeyDown={this.cancellProfile}
          tabIndex="0"
        >
          <div className="my-profile-inside">
            <AddFriend
              addFriend={this.props.addFriend}
              name={this.props.name}
            />
          </div>
        </div>
      );
    }
  }
}

export default UserProfile;
