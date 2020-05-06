import React, { Component } from "react";
import "./info.css";

import { connect } from "react-redux";

import ProfileBox from "../../../FUNCTIONS/profile-box";

class Info extends Component {
  render() {
    const profileBoxState = this.props.profileBoxState;

    var infoDiv = null;

    if (profileBoxState.email) {
      infoDiv = (
        <div className="info-div">
          <ProfileBox
            profileUrl={profileBoxState.url}
            fullName={profileBoxState.fullName}
            pickImage={null}
            click={null}
            locationText={profileBoxState.location}
            websiteText={profileBoxState.website}
            timeStampMonth={profileBoxState.timeStamp.month}
            timeStampYear={profileBoxState.timeStamp.year}
            openModal={null}
          />
        </div>
      );
    }

    return infoDiv;
  }
}

const mapStateToProps = (state) => {
  return {
    profileBoxState: state.ProfileBoxReducer,
  };
};

export default connect(mapStateToProps, null)(Info);
