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
  // const { id, name, description } = req.body; // there is no id that is a part of body.  There should just be a count and duration.  The id that we need is coming off of req.params and it should be req.params.routineActivityId
  const { count, duration } = req.body;
  const { routineActivityId } = req.params;

  try {
    // const patch = await updateActivity(id, name, description);  also, in this route we are not trying to update the activity, we are instead trying to update the routineActivity by using the updateRoutineActivity function.

    const patch = await updateRoutineActivity({
      id: req.params.routineActivityId,
      count,
      duration,
    });
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
