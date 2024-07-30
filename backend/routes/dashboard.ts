import { Router } from "express";
import dummyData from "../data";

const router = Router();

router.get("/", (req, res) => {
  res.json(dummyData);
});

export default router;
