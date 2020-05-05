import React from "react";

import Location from "../../media/location.png";
import Website from "../../media/website.png";
import Calender from "../../media/calender.png";

const profileBox = (props) => {
  return (
    <div className="inside-sec-two">
      <img src={props.profileUrl} alt="profileImg" className="profile-img" />
      <p className="profilebox-name-title-p">{props.fullName}</p>

      <div className="wrap-img-pen">
        {props.Pen ? (
          <img
            src={props.Pen}
            className="profile-box-pen-image"
            alt="penImg"
            onClick={() => props.click()}
          />
        ) : null}
      </div>
      <div className="profile-box-div-info">
        <div className="row-div-inside">
          <img src={Location} alt="location" />

          <p className="location-p">{props.locationText}</p>
        </div>
        <div className="row-div-inside">
          <img src={Website} alt="website" />
          <p className="website-p"> {props.websiteText} </p>
        </div>
        <div className="row-div-inside">
          <img src={Calender} alt="calender" />
          joined {props.timeStampMonth} {props.timeStampYear}
        </div>
        <div className="wrap-img-pen2">
          {props.Pen ? (
            <img
              onClick={props.openModal}
              className="edit-profile-bio"
              src={props.Pen}
              alt="penImg"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default profileBox;
