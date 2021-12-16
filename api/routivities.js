const express = require("express");
const aRouter = express.Router();
const { requireUser } = require("./utils");
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

aRouter.use((req, res, next) => {
  console.log("A request is being made to routine activities");

  next(); // THIS IS DIFFERENT
});

aRouter.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { id, name, description } = req.body;
  try {
    const patch = await updateActivity(id, name, description);
    if (patch) {
      res.send(patch);
    } else {
      next({
        name: "error",
        message: "destroyRoutineActivity",
      });
    }
  } catch (err) {
    next(err);
  }
});

aRouter.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  try {
    const close = await destroyRoutineActivity(routineActivityId);
    if (!close) {
      next({
        name: "error",
        message: "destroyRoutineActivity",
      });
    }
    // else {
    //   res.send(close);
    // }
  } catch (err) {
    next(err);
  }
});

module.exports = aRouter;
