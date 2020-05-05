const faunadb = require("faunadb"),
  q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnADpXV26AACAF7vvX31-YMZ70yB_K2fhYxFLdYS",
});

const actionTypes = {
  setCommentRef: (id) => {
    return {
      type: "setCommentRef",
      val: id,
    };
  },

  loadPosts: () => {
    return (dispatch) => {
      var storeArr = [];
      var localS = JSON.parse(
        typeof window !== "undefined" && localStorage.getItem("myData")
      );
      var email = localS.email;
      var ref = localS.ref;
      client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("get_posts"))),
            q.Lambda("X", q.Get(q.Var("X")))
          )
        )
        .then((ret) => {
          var secondArr = false;
          if (ret.data.length > 0) {
            ret.data.map((el) => {
              el.data.ref = el.ref.value.id;
              return storeArr.push(el.data);
            });

            if (storeArr.length > 4) {
              var copyArr = JSON.parse(JSON.stringify(storeArr));
              const firstArr = copyArr.slice(copyArr.length - 5);
              copyArr.splice(copyArr.length - 5, copyArr.length);
              storeArr = firstArr;
              secondArr = copyArr;
            }
            dispatch(actionTypes.renderPosts(storeArr, email, ref, secondArr));
          } else {
            dispatch(actionTypes.renderPosts([], email, ref, []));
          }
        });
    };
  },

  renderPosts: (storeArr, email, ref, secondArr) => {
    return {
      type: "renderPosts",
      val: storeArr,
      email,
      ref,
      secondArr,
    };
  },
  createNewPost: (postProperties) => {
    var localS = JSON.parse(
      typeof window !== "undefined" && localStorage.getItem("myData")
    );
    const userRef = localS.ref;

    return (dispatch) => {
      client
        .query(
          q.Create(q.Collection("posts"), {
            data: {
              fullName: postProperties.fullName,
              postedTime: postProperties.postedTime,
              displayTime: "Right now...",
              text: postProperties.text,
              likes: [],
              comments: [],
              email: postProperties.email,
              imageUrl: postProperties.url,
              uniqeId: postProperties.uniqeId,
              ref: "",
              userRef,
            },
          })
        )
        .then((ret) => {
          ret.data.ref = ret.ref.value.id;
          postProperties.state.push(ret.data);
          dispatch(actionTypes.updatePost(postProperties.state));

          document
            .querySelector(".posts-modal-inside")
            .classList.remove("createPostSpinner");

          document.querySelector(".posts-modal").style.display = "none";

          document.querySelectorAll("#standard-basic")[0].value = "";
        });
    };
  },
  updatePost: (data) => {
    return {
      type: "updatePost",
      val: data,
    };
  },
  likeOnPost: (properties) => {
    return (dispatch) => {
      client
        .query(
          q.Update(q.Ref(q.Collection("posts"), properties.ref), {
            data: {
              likes: properties.updatedLike,
            },
          })
        )
        .then((ret) => {
          dispatch(actionTypes.addLike(properties.copyPosts));
        });
    };
  },
  addLike: (newLikesArr) => {
    return {
      type: "addLike",
      val: newLikesArr,
    };
  },
  displayBtn: () => {
    return {
      type: "displayBtn",
    };
  },
  deletePost: (pro) => {
    return (dispatch) => {
      client
        .query(q.Delete(q.Ref(q.Collection("posts"), pro.ref)))
        .then((ret) => {
          dispatch(actionTypes.deletingPost(pro));

          document
            .querySelector(".delete-modal-inside-div")
            .classList.remove("deletePostSpinner");
        });
    };
  },
  deletingPost: (pro) => {
    document.querySelector(".delete-modal-div").style.display = "none";
    return {
      type: "deletePost",
      val: pro.copyPost,
    };
  },
  loadSecondArr: (posts) => {
    return {
      type: "loadSecondArr",
      val: posts,
    };
  },
};

export default actionTypes;
