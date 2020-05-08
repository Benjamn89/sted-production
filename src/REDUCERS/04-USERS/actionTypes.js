import boxActionTypes from "../02-HOME-PAGE/01-PROFILE-BOX/actionTypes";

const faunadb = require("faunadb"),
  q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnADpXV26AACAF7vvX31-YMZ70yB_K2fhYxFLdYS",
});

const actionTypes = {
  resetStateUsers: () => {
    return {
      type: "resetStateUsers",
    };
  },

  fetchUserData: (profileRef) => {
    document.querySelector(".my-profile-div").classList.add("showSpinner");
    var localS =
      typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("myData"));
    var loginRef = localS.ref;
    var loginUser, profileUser;
    return (dispatch) => {
      Promise.all([
        client
          .query(q.Get(q.Ref(q.Collection("Users"), loginRef)))
          .then((ret) => {
            ret.data.ref = ret.ref.value.id;
            return (loginUser = ret.data);
          }),
        client
          .query(q.Get(q.Ref(q.Collection("Users"), profileRef)))
          .then((ret) => {
            ret.data.ref = ret.ref.value.id;
            return (profileUser = ret.data);
          }),
      ])
        .then((sucess) => {
          const obj = {
            profileUser,
            loginUser,
          };
          dispatch(actionTypes.renderUserData(obj));
        })
        .catch((err) => {
          document
            .querySelector(".my-profile-div")
            .classList.remove("showSpinner");
        });
    };
  },

  fetchUserDirect: (profileRef) => {
    document.querySelector(".my-profile-div").classList.add("showSpinner");
    var localS =
      typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("myData"));
    var loginRef = localS.ref;
    var profileUser, loginUser;
    return (dispatch) => {
      Promise.all([
        client
          .query(q.Get(q.Ref(q.Collection("Users"), profileRef)))
          .then((ret) => {
            ret.data.ref = ret.ref.value.id;
            return (profileUser = ret.data);
          }),
        client
          .query(q.Get(q.Ref(q.Collection("Users"), loginRef)))
          .then((ret) => {
            ret.data.ref = ret.ref.value.id;
            return (loginUser = ret.data);
          }),
      ]).then((sucess) => {
        const obj = {
          loginUser,
          profileUser,
        };
        dispatch(actionTypes.renderUserData(obj));
      });
    };
  },
  renderUserData: (obj) => {
    document.querySelector(".my-profile-div").classList.remove("showSpinner");
    return {
      type: "renderUserData",
      val: obj,
      view: "Info",
    };
  },
  fetchPostsFromUsers: (pro) => {
    var storeArr = [];
    return (dispatch) => {
      client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("get_posts_byemail"), pro.email)),
            q.Lambda("e", q.Get(q.Var("e")))
          )
        )
        .then((ret) => {
          ret.data.map((el) => {
            var ref = el.ref.value.id;

            el.data.ref = ref;
            return storeArr.push(el.data);
          });
          dispatch(actionTypes.renderPostsFromUsers(storeArr, pro));
        });
    };
  },
  renderPostsFromUsers: (posts, pro) => {
    document.querySelector(".my-pro-view-div").classList.remove("showSpinner");
    return {
      type: "renderPostsFromUsers",
      val: posts,
      section: pro.title,
    };
  },
  changeSecWithNoFetch: (title) => {
    return {
      type: "changeSecWithNoFetch",
      val: title,
    };
  },
  updateLikeUsersAction: (pro) => {
    return (dispatch) => {
      client
        .query(
          q.Update(q.Ref(q.Collection("posts"), pro.ref), {
            data: {
              likes: pro.posts[pro.index].likes,
            },
          })
        )
        .then((ret) => {
          dispatch(actionTypes.updateLikeUsers(pro.posts));
        });
    };
  },
  updateLikeUsers: (posts) => {
    return {
      type: "updateLikeUsers",
      val: posts,
    };
  },
  deletePostUsersAction: (pro) => {
    return (dispatch) => {
      client
        .query(q.Delete(q.Ref(q.Collection("posts"), pro.ref)))
        .then(() => dispatch(actionTypes.deletePostFromUsers(pro.posts)));
    };
  },
  deletePostFromUsers: (newPosts) => {
    document
      .querySelectorAll(".delete-modal-inside-div")[1]
      .classList.remove("deleteCommentSpinner");

    document.querySelectorAll(".delete-modal-div")[1].style.display = "none";
    return {
      type: "deletePostFromUsers",
      val: newPosts,
    };
  },
  updateFriendsUserAction: (obj) => {
    return (dispatch) => {
      client
        .query(
          q.Update(q.Ref(q.Collection("Users"), obj.ref), {
            data: {
              friends: obj.friendsArr,
            },
          })
        )
        .then((ret) => {
          dispatch(actionTypes.updateFriendsUserRender(ret.data));
          dispatch(boxActionTypes.updateFriendsBoxProfile(ret.data.friends));
        });
    };
  },
  updateFriendsUserRender: (data) => {
    document.querySelector(".no-friends-div").classList.remove("showSpinner2");
    return {
      type: "updateFriendsUserRender",
      val: data,
    };
  },
};

export default actionTypes;
