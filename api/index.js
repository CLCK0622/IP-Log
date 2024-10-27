import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const { rows } = await sql`SELECT * FROM visitors ORDER BY visit_timestamp DESC`;

    let html = `
      <html>
      <head>
        <title>IP Log</title>
      </head>
      <body>
        <h1>IP Logs</h1>
        <table>
          <tr>
            <th>IP Address</th>
            <th>Visit Timestamp</th>
            <th>Site URL</th>
          </tr>`;

    rows.forEach(row => {
        const visitTime = new Date(row.visit_timestamp).toLocaleString("en-US", {
            timeZone: "Asia/Shanghai"
          });
      html += `
          <tr>
            <td>${row.ip_address}</td>
            <td>${row.country || 'Unknown'}</td>
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
