import db from "./db.js";

export async function seedDatabase() {
  await db.query(`
    INSERT INTO users (id, name, email, password_hash)
    VALUES ('u1', 'Prueba', 'prueba@ejemplo.com', 'sin_hash')
    ON CONFLICT (id) DO NOTHING
  `);
}
