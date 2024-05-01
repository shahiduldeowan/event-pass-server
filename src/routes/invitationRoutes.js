import { Router } from "express";
import { verifyInvitation } from "../controllers/invitationControllers.js";

const router = Router();

router.route("/verify").post(verifyInvitation);

export default router;
