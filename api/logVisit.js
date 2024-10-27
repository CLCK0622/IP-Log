import { sql } from '@vercel/postgres';

async function getCountryDataByIP(ip) {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      if (data.status === "success") {
        return {
          country: data.country || "Unknown",
          countryCode: data.countryCode || ""
        };
      }
      return { country: "Unknown", countryCode: "" };
    } catch (error) {
      console.error("Error fetching country data:", error);
      return { country: "Unknown", countryCode: "" };
    }
  }

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    try {
        const { fullUrl } = req.body;
        const ip = req.headers['x-forwarded-for'] || "N/A";
        const siteUrl = fullUrl || req.headers['referer'] || "N/A";

        const { country, countryCode } = await getCountryDataByIP(ip);

        await sql`
      INSERT INTO visitors (ip_address, site_url, country, countryCode) VALUES (${ip}, ${siteUrl}, ${country}, ${countryCode})
    `;

        res.status(200).json({ message: 'logged successfully' });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: 'Failed to log', error: error.message });
    }
}
