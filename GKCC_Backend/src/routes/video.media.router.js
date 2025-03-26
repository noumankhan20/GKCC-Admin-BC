import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deletealbum, deletevideofromalbum, uploadVideoonMediaPage, viewVideomedia , addvideoonalbum, editalbum} from "../controllers/video.media.controller.js";

const router = Router();

// Base route to test API health
router.route("/").post(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "API of media is working"));
});

router.route("/add").post(
    uploadVideoonMediaPage
  );

router.route("/viewalbum").get(
  viewVideomedia
)

router.route("/addvideo/:_id").put(addvideoonalbum)

router.route("/deletealbum/:_id").delete(deletealbum)

router.route("/deletevideo/:_id/:_VidId").delete(deletevideofromalbum)

router.route("/editalbum/:id").put(editalbum)

export default router;
