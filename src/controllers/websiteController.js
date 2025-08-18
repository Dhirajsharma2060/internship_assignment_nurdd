import prisma from "../models/db.js";
import scrapeWebsite from "../services/scraper.js";

// POST /api/websites/analyze
export const analyzeWebsite = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    if (url.length > 2048) {
      return res.status(400).json({ error: "URL is too long" });
    }

    const existing=await prisma.website.findUnique({where:{url}});
    if (existing){
      return res.status(409).json({error:"Website already exist"});
    }

    // Scrape brand + description
    const { brandName, description } = await scrapeWebsite(url);

    // Avoid storing fallback data
    if (
      brandName === "Unknown" &&
      description === "Could not fetch description"
    ) {
      return res.status(400).json({
        error: "Website could not be scraped or is inaccessible.",
      });
    }

    // Save to DB
    const website = await prisma.website.create({
      data: { url, brandName, description },
    });

    res.status(201).json({ id: website.id, brandName: website.brandName });
  } catch (error) {
    console.error("Analyze error:", error); // Log full error
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// GET /api/websites
export const getWebsites = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // SELECT operation with limit 
    const [websites, total] = await Promise.all([
      prisma.website.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      // SELECT COUNT(*)
      prisma.website.count(),
    ]);

    res.json({
      data: websites,
      page,
      limit,
      // using the count 
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get websites error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// PATCH /api/websites/:id
export const updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, description } = req.body;

    if (
      (brandName === undefined || brandName === null) &&
      (description === undefined || description === null)
    ) {
      return res.status(400).json({
        error: "At least one of brandName or description must be provided",
      });
    }

    // Fetch current record
    const existing = await prisma.website.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Website not found." });
    }

    // Check if the update would actually change anything
    if (
      (brandName === undefined || brandName === existing.brandName) &&
      (description === undefined || description === existing.description)
    ) {
      return res.status(400).json({
        error: "No changes detected. At least one field must be different from the current value.",
      });
    }

    const updated = await prisma.website.update({
      where: { id: Number(id) },
      data: { brandName, description },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update website error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// DELETE /api/websites/:id
export const deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.website.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Website deleted successfully" });
  } catch (error) {
    console.error("Delete website error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
