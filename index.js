import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const { rows } = await sql`SELECT * FROM visitors ORDER BY visit_timestamp DESC`;

    let html = `
      <html>
      <head><title>IP Log</title></head>
      <body>
        <h1>IP Logs</h1>
        <table border="1">
          <tr>
            <th>IP Address</th>
            <th>Visit Timestamp</th>
          </tr>`;
    rows.forEach(row => {
      html += `
          <tr>
            <td>${row.ip_address}</td>
            <td>${row.visit_timestamp}</td>
          </tr>`;
    });
    html += `
        </table>
      </body>
      </html>`;
      
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load IP logs');
  }
}
