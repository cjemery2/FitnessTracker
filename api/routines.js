const express = require("express");
const routinesRouter = express.Router();
const { requireUser } = require("./utils");
routinesRouter.use((req, res, next) => {
  console.log("A request is being made to routines");
  next(); // THIS IS DIFFERENT
});
// NEW
const {
  getUserById,
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  getRoutineById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  createUser,
  getUser,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  attachActivitiesToRoutines,
} = require("../db");

routinesRouter.get("/", async (req, res, next) => {
  try {
    
    // const routines = await getAllRoutines(); //this function was breaking because you were grabbing all routines, but the test is only asking for the public routines
    const routines = await getAllPublicRoutines();
    if (routines) {
      res.send(routines);
    } else {
      next({
        name: "error",
        message: "getAllRoutines",
      });
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  try {
    const routine = await createRoutine({
      creatorId: req.user.id,
      isPublic,
      name,
      goal,
    }); //here we need to get the user.id off of req.user.id.  This value is not being passed as a part of the body from the test.

    if (routine) {
      res.send(routine);
    } else {
      next({
        name: "error",
        message: "createRoutine",
      });
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  
  // const { isPublic, name, goal } = routine; // these values should be coming off the req.body
  const { isPublic, name, goal } = req.body
  const routine = getRoutineById(routineId);
  try {
    const update = await updateRoutine({ id: routineId, isPublic, name, goal }); //this needed to be wrapped in {}
    if (update) {
      res.send(update);
    } else {
      next({
        name: "error",
        message: "updateRoutine",
      });
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  try {
    const close = await destroyRoutine(routineId);
    if (close) {
      res.send(close);
    } else {
      next({
        name: "error",
        message: "destroyRoutine",
      });
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.post(
  "/:routineId/activities",
  requireUser,
  async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    try {
      const routine = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      }); // these variables needed to be sent as part of an object

      if (routine) {
        res.send(routine);
      } else {
        next({
          name: "error",
          message: "destroyRoutine",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routinesRouter;
