import { Router } from "express";
import {
  verifyInvitation,
  watchInvitation,
} from "../controllers/invitationControllers.js";

const router = Router();

router.route("/verify").post(verifyInvitation);
router.route("/watch").post(watchInvitation);

export default router;
