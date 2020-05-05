const exitLikeBox = (e) => {
  const eClass = e.target.className;

  if (
    eClass !== "in-likes-box in-likes-box-show" &&
    eClass !== "i-f-p-l-s" &&
    document.querySelector(".in-likes-box-show")
  ) {
    document
      .querySelector(".in-likes-box-show")
      .classList.remove("in-likes-box-show");

    document.removeEventListener("click", exitLikeBox);
  }
};

var ShowLikes = (e) => {
  if (e.target.className === "i-f-p-l-s") {
    const doc = e.target.parentNode.parentNode.children[0].children[1];

    var lastDoc = document.querySelector(".in-likes-box-show");

    if (lastDoc && lastDoc !== doc) {
      lastDoc.classList.remove("in-likes-box-show");
    }

    doc.classList.toggle("in-likes-box-show");

    document.addEventListener("click", exitLikeBox);
  }

  if (!document.querySelector(".in-likes-box-show")) {
    document.removeEventListener("click", exitLikeBox);
  }
};

export default ShowLikes;
