import express from "express";
import {
  analyzeWebsite,
  getWebsites,
  updateWebsite,
  deleteWebsite,
} from "../controllers/websiteController.js";

const router = express.Router();



/**
 * @swagger
 * /api/websites/analyze:
 *   post:
 *     summary: Scrape and save website metadata
 *     description: |
 *       Accepts a website URL, scrapes the site for brand name and description, and stores the result in the database.
 *       Returns the new website's ID and brand name.
 *     tags: [Websites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the website to analyze.
 *                 example: "https://example.com"
 *     responses:
 *       201:
 *         description: Website analyzed and saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 brandName:
 *                   type: string
 *                   example: "Example Brand"
 *       400:
 *         description: Invalid input (missing or invalid URL).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid URL format"
 *       500:
 *         description: Server error or scraping failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */
router.post("/analyze",analyzeWebsite);

/**
 * @swagger
 * /api/websites:
 *   get:
 *     summary: Get all stored websites
 *     description: Retrieve a list of all websites that have been analyzed and stored in the database.
 *     tags: [Websites]
 *     responses:
 *       200:
 *         description: List of websites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       url:
 *                         type: string
 *                         example: "https://example.com"
 *                       brandName:
 *                         type: string
 *                         example: "Example Brand"
 *                       description:
 *                         type: string
 *                         example: "This is an example website."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-17T11:45:05.245Z"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */
router.get("/", getWebsites);

/**
 * @swagger
 * /api/websites/{id}:
 *   patch:
 *     summary: Update a website record
 *     description: Update the brand name and/or description of an existing website record by its ID.
 *     tags: [Websites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the website to update.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *                 description: The new brand name.
 *               description:
 *                 type: string
 *                 description: The new description.
 *           example: {}
 *     responses:
 *       200:
 *         description: Website updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 brandName:
 *                   type: string
 *                   example: "Updated Brand"
 *                 description:
 *                   type: string
 *                   example: "Updated website description."
 *       400:
 *         description: Invalid input (missing or invalid fields).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       404:
 *         description: Website not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Check the ID properly. Website not found."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */
router.patch("/:id", updateWebsite);

/**
 * @swagger
 * /api/websites/{id}:
 *   delete:
 *     summary: Delete a website record
 *     description: Delete a website record from the database by its ID.
 *     tags: [Websites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the website to delete.
 *         example: 1
 *     responses:
 *       200:
 *         description: Website deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Website deleted successfully"
 *       404:
 *         description: Website not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Check the ID properly. Website not found."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */
router.delete("/:id", deleteWebsite);

export default router;
