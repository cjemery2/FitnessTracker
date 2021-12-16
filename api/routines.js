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
    console.log('inroutines')
    const routines = await getAllRoutines();
    console.log(routines)
    if (routines) {
      res.send(routines);
    } else {
      next({
        name: "error",
        message: "getAllRoutines",
      });
    }
  } catch ( error ) {
    next( error );
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  console.log(req.body, "HOERLEREO")
  const { creatorId, isPublic, name, goal } = req.body;
  try {
    const routine = await createRoutine({creatorId, isPublic, name, goal});

  console.log(routine, " HELLO WORLD")
    if (routine) {
      res.send(routine);
    } else {
      next({
        name: "error",
        message: "createRoutine",
      });
    }
  } catch ( error ) {
    next( error );
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  console.log(routineId, "ROUTINEEEEEE")
  const routine = getRoutineById(routineId);
  const { isPublic, name, goal } = routine;
  try {
    const update = await updateRoutine(routineId, isPublic, name, goal);
    if (update) {
      res.send(update);
    } else {
      next({
        name: "error",
        message: "updateRoutine",
      });
    }
  } catch ( error ) {
    next( error );
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
  } catch ( error ) {
    next( error );
  }
});

routinesRouter.post(
  "/:routineId/activities",
  requireUser,
  async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    try {
      const routine = await addActivityToRoutine(
        routineId,
        activityId,
        count,
        duration
      );

      if (routine) {
        res.send(routine);
      } else {
        next({
          name: "error",
          message: "destroyRoutine",
        });
      }
    } catch ( error ) {
      next( error );
    }
  });


module.exports = routinesRouter;