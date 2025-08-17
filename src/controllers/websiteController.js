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

    // Scrape brand + description
    const { brandName, description } = await scrapeWebsite(url);

    // Save to DB
    // INSERT operation in DB
    const website = await prisma.website.create({
      data: { url, brandName, description },
    });

    res.status(201).json({id:website.id,brandName:website.brandName});
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
