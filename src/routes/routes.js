import express from "express";
import {
  analyzeWebsite,
  getWebsites,
  updateWebsite,
  deleteWebsite,
} from "../controllers/websiteController.js";

const router = express.Router();

// POST /api/websites/analyze → scrape + save
router.post("/analyze", analyzeWebsite);

// GET /api/websites → fetch all records
router.get("/", getWebsites);

// PUT /api/websites/:id → update a record
router.patch("/:id", updateWebsite);

// DELETE /api/websites/:id → delete a record
router.delete("/:id", deleteWebsite);

export default router;
