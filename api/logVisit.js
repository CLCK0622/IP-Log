import { sql } from '@vercel/postgres';

async function getCountryByIP(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (data.status === "success") {
      return data.country || "Unknown";
    }
    return "Unknown";
  } catch (error) {
    console.error("Error fetching country data:", error);
    return "Unknown";
  }
}

export default async function handler(req, res) {
  try {
    const { fullUrl } = req.body;
    const ip = req.headers['x-forwarded-for'] || "N/A";
    const siteUrl = fullUrl || req.headers['referer'] || "N/A";

    const country = await getCountryByIP(ip);

    await sql`
      INSERT INTO visitors (ip_address, site_url, country) VALUES (${ip}, ${siteUrl}, ${country})
    `;

    res.status(200).json({ message: 'logged successfully' });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: 'Failed to log', error: error.message });
  }
}
