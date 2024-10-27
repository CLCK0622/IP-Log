import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const { rows } = await sql`SELECT * FROM visitors ORDER BY visit_timestamp DESC`;

    let html = `
      <html>
      <head>
        <title>IP Log</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>IP Logs</h1>
        <table>
          <tr>
            <th>IP Address</th>
            <th>Country</th>
            <th>Visit Time</th>
            <th>Site URL</th>
          </tr>`;

    rows.forEach(row => {
        const visitTime = new Date(row.visit_timestamp).toLocaleString("en-US", {
            timeZone: "Asia/Shanghai"
          });
      html += `
          <tr>
            <td>${row.ip_address}</td>
            <td>${row.country || 'Unknown'} <img src="https://flagsapi.com/${row.countryCode}/flat/64.png"></td>
            <td>${visitTime} (GMT+8)</td>
            <td>${row.site_url || 'N/A'}</td>
          </tr>`;
    });

    html += `
        </table>
      </body>
      </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error("Error fetching IP logs:", error);
    res.status(500).send('Failed to load IP logs');
  }
}
