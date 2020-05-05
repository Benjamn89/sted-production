const exitLikeBox = (e) => {
  if (
    e.target.className !== "com-in-likes-box com-in-likes-box-show" &&
    e.target.className !== "likes-comment-p"
  ) {
    if (document.querySelector(".com-in-likes-box")) {
      document
        .querySelector(".com-in-likes-box")
        .classList.remove("com-in-likes-box-show");

      document.removeEventListener("click", exitLikeBox);
    }
  }
};

var ShowLikes = (e) => {
  document
    .querySelector(".com-in-likes-box")
    .classList.toggle("com-in-likes-box-show");

  document.addEventListener("click", exitLikeBox);
};

export default ShowLikes;
