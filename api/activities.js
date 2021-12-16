const express = require("express");
const {
  createActivity,
  getAllActivities,
  updateActivity,
} = require("../db/activities");
const { requireUser } = require("./utils");
const activityRouter = express.Router();

activityRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    if (activities) {
      res.send(activities);
    } else {
      res.send({ message: "No activities found" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activityRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const activityData = {};

  try {
    activityData.name = name;
    activityData.description = description;

    const activity = await createActivity({ name, description });
    console.log(activity, 'hiiiii')
    res.send(activity);
  } catch (error) {
    throw error;
  }
});

activityRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const { activityId } = req.params;

  try {
    const updatedActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });
    res.send(updatedActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = activityRouter;