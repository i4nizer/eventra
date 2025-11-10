import express from "express";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

//

const activitySection = express.Router({ mergeParams: true });
activitySection
  .route("/")
  .get(middlewares.auth.access, controllers.activitySection.get);
activitySection
  .route("/section/:secid")
  .post(middlewares.auth.access, controllers.activitySection.post);
activitySection
  .route("/:aseid")
  .get(middlewares.auth.access, controllers.activitySection.get)
  .delete(middlewares.auth.access, controllers.activitySection.destroy);
activitySection
  .route("/:aseid/section/:secid")
  .get(middlewares.auth.access, controllers.activitySection.get)
  .patch(middlewares.auth.access, controllers.activitySection.patch)
  .delete(middlewares.auth.access, controllers.activitySection.destroy);

//

export default activitySection;
