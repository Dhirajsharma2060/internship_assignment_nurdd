import axios from "axios";
import * as cheerio from "cheerio";

const scrapeWebsite = async (url) => {
  try {
    // Fetch page HTML
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }, // mimic browser
      timeout: 10000, // 10s timeout
    });

    // Load into Cheerio
    const $ = cheerio.load(html);

    // Extract brand name
    let brandName =
      $('meta[property="og:site_name"]').attr("content") || $("title").text();

    if (!brandName) {
      brandName = url.replace(/^https?:\/\//, "").split("/")[0]; // fallback → domain name
    }

    // Extract description
    let description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $("p").first().text();

    if (!description) {
      description = "No description available";
    }

    return { brandName: brandName.trim(), description: description.trim() };
  } catch (error) {
    console.error("Scraping failed:", error.message);
    return { brandName: "Unknown", description: "Could not fetch description" };
  }
};

export default scrapeWebsite;
