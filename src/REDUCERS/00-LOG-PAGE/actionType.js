const faunadb = require("faunadb"),
  q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnADpMLFl0ACAsnF_Eab0pOmjNt_eYUo0mHMA6O3",
});

const bcrypt = require("bcryptjs");

const actionTypes = {
  changeView: (viewMode, regMode) => {
    return {
      type: "changeview",
      view: viewMode,
      regMode,
    };
  },
  createUser: () => {
    document
      .querySelector(".welcome-part2-div")
      .classList.remove("showSpinner");
    return {
      type: "regChanged",
    };
  },

  sendCreateRequest: (obj) => {
    return (dispatch) => {
      client
        .query(q.Exists(q.Match(q.Index("email_exists"), obj.email)))
        .then((ret) => {
          if (ret === true) {
            dispatch(actionTypes.userExists());
          } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(obj.password, salt);

            var time = new Date().toString();
            client
              .query(
                q.Create(q.Collection("Users"), {
                  credentials: { password: hash },
                  data: {
                    fullName: obj.fullName,
                    email: obj.email,
                    password: hash,
                    profileImg: obj.defaultImgUrl,
                    time,
                    location: "EDIT",
                    website: "EDIT",
                    friends: [],
                  },
                })
              )
              .then((ret) => {
                dispatch(actionTypes.createUser());
              });
          }
        });
    };
  },
  userExists: () => {
    document
      .querySelector(".welcome-part2-div")
      .classList.remove("showSpinner");

    document.querySelector(".form-button").classList.add("email-warning");
    return {
      type: null,
    };
  },
  logIn: (email, pass) => {
    return (dispatch) => {
      client
        .query(q.Exists(q.Match(q.Index("email_exists"), email)))
        .then((ret) => {
          if (ret) {
            client
              .query(q.Get(q.Match(q.Index("email_exists"), email)))
              .then((ret) => {
                var check = bcrypt.compareSync(pass, ret.data.password);

                var generatePass = ret.data.password;

                var ref = ret.ref.value.id;
                if (check === true) {
                  var now = new Date();
                  var storeKey = {
                    key: true,
                    time: now.getTime() + 3600000,
                    email,
                    ref,
                  };
                  typeof window !== "undefined" &&
                    localStorage.setItem("myData", JSON.stringify(storeKey));

                  client
                    .query(
                      q.Login(q.Match(q.Index("email_exists"), email), {
                        password: generatePass,
                      })
                    )
                    .then((ret) => {
                      dispatch(actionTypes.logInSuccess(email));
                    });
                } else {
                  document
                    .querySelector(".log-in-div")
                    .classList.remove("showSpinner2");

                  document.querySelector(".clear-password").value = "";

                  document
                    .querySelector(".text-for-warning")
                    .classList.add("invalid-msg");
                }
              });
          } else {
            document
              .querySelector(".log-in-div")
              .classList.remove("showSpinner2");

            document.querySelector(".clear-password").value = "";

            document
              .querySelector(".text-for-warning")
              .classList.add("invalid-msg");
          }
        });
    };
  },
  logInSuccess: (email) => {
    return {
      type: "logInSuccess",
      email,
    };
  },
};

export default actionTypes;
