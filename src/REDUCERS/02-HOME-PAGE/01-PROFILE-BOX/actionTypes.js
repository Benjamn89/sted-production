import axios from "axios";

const faunadb = require("faunadb"),
  q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnADpXV26AACAF7vvX31-YMZ70yB_K2fhYxFLdYS",
});

const actionTypes = {
  renderProfileImage: (storeInputPick, refDoc) => {
    var newImgUrl;
    return (dispatch) => {
      const fd = new FormData();
      fd.append("image", storeInputPick, storeInputPick.name);
      axios
        .post(
          "https://us-central1-sted-7c8ac.cloudfunctions.net/uploadFile",
          fd
        )
        .then((res) => {
          newImgUrl = `https://firebasestorage.googleapis.com/v0/b/sted-7c8ac.appspot.com/o/${storeInputPick.name}?alt=media`;

          client.query(
            q.Update(q.Ref(q.Collection("Users"), refDoc), {
              data: { profileImg: newImgUrl },
            })
          );

          document
            .querySelector(".posts-sec-wrapper")
            .classList.remove("showSpinner");

          dispatch(actionTypes.changeImageState(newImgUrl));
        });
    };
  },

  changeImageState: (url) => {
    return {
      type: "changeProfileImage",
      url: url,
    };
  },

  retriveLoginData: () => {
    return (dispatch) => {
      var localS =
        typeof window !== "undefined" && localStorage.getItem("myData");
      var parseLocal = JSON.parse(localS);

      client
        .query(q.Get(q.Match(q.Index("email_exists"), parseLocal.email)))
        .then((ret) => {
          var splitTime = ret.data.time.split(" ");
          var timeStamp = {
            year: splitTime[3],
            month: splitTime[1],
            day: splitTime[2],
          };
          var dataObj = {
            fullName: ret.data.fullName,
            url: ret.data.profileImg,
            location: ret.data.location,
            website: ret.data.website,
            email: ret.data.email,
            friends: ret.data.friends,
            timeStamp,
            refToProDoc: parseLocal.ref,
          };
          dispatch(
            actionTypes.renLogingData(dataObj, parseLocal.ref, timeStamp)
          );
        });
    };
  },
  renLogingData: (dataObj, refToProDoc, timeStamp) => {
    return {
      type: "renLogingData",
      dataObj,
      refToProDoc,
      timeStamp,
    };
  },
  establishFetch: (ref, location, website) => {
    return (dispatch) => {
      client
        .query(
          q.Update(q.Ref(q.Collection("Users"), ref), {
            data: { location, website },
          })
        )
        .then((ret) => {
          document
            .querySelector(".posts-sec-wrapper")
            .classList.remove("showSpinner");
          dispatch(actionTypes.renderProInfo(location, website));
        });
    };
  },
  renderProInfo: (location, web) => {
    return {
      type: "renderProInfo",
      val: {
        location,
        web,
      },
    };
  },
  updateFriendsBoxProfile: (friendsArr) => {
    return {
      type: "updateFriendsBoxProfile",
      val: friendsArr,
    };
  },
};

export default actionTypes;
