import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    await sql`
      INSERT INTO visitors (ip_address) VALUES (${ip})
    `;

    res.status(200).json({ message: 'IP logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to log IP' });
  }
}
