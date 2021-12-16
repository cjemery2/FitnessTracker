const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUser,
  getUserByUsername,
  getUserById,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");
const { JWT_SECRET = "neverTell" } = process.env;
const { requireUser } = require("./utils");

// usersRouter.get("/", async (req, res, next) => {
//   const users = await getAllUsers();

//   res.send({
//     users,
//   });
// });
// let mainUser = ''

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  console.log("Hello");

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    console.log("this is user", user);
    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      // mainUser = username
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      console.log("this is token", token);
      res.send({ user, token, message: "you are logged in!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const queriedUser = await getUserByUsername(username);

    if (queriedUser) {
      res.status(401);

      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    } else if (password.length < 8) {
      res.status(401);

      next({
        name: "PasswordLengthError",
        message: "Password Too Short!",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });
      if (!user) {
        next({
          name: "UserCreationError",
          message: "There was a problem registering you. Please try again.",
        });
      } else {
        // mainUser = username
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );

        res.send({
          user,
          message: "you're signed up!",
          token,
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  // const token = req.headers.authorization;
  try {
    //const user = await getUserByUsername(mainUser);
    console.log(req.user)
   if(!req.user){
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action"
    });

   }else{
     console.log(req.user, "!!!!!!!!!!!!!")
     req.send(req.user)
   }
    // if (token) {
    //   console.log(req.user, "req.user");
    //   res.send(req.user);
    // }
    // if (!token) {
    //   res.status(401);
    //   next({
    //     name: "Invalid token",
    //     message: "Unauthorized",
    //   });
    // }
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  try {
    const publicRoutines = await await getPublicRoutinesByUser({ username });
    if (publicRoutines) {
      res.send(publicRoutines);
    } else {
      next({
        name: "error",
        message: "cannot get routines for this user",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = usersRouter;