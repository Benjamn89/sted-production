const initialState = {
  getPost: false,
  postRef: null,
  copyPost: null,
  updatedPost: false,
};

const reducer = (state = initialState, action) => {
  if (action.type === "getPost") {
    return {
      ...state,
      getPost: !state.getPost,
      postRef: action.ref,
      copyPost: action.copyPost,
    };
  }
  if (action.type === "updateComment") {
    return {
      ...state,
      updatedPost: !state.updatedPost,
      copyPost: action.updatedPost,
    };
  }
  if (action.type === "addLikeComment") {
    var newCopyPost = JSON.parse(JSON.stringify(state.copyPost));

    newCopyPost.likes = action.val;

    return {
      ...state,
      updatedPost: !state.updatedPost,
      copyPost: newCopyPost,
    };
  }
  if (action.type === "deleteComment") {
    var copyPost = JSON.parse(JSON.stringify(state.copyPost));

    copyPost.comments = action.val;
    return {
      ...state,
      updatedPost: !state.updatedPost,
      copyPost: copyPost,
    };
  }
  return state;
};

export default reducer;
