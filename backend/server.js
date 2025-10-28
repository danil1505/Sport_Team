import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// подключение к базе данных
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "sport_team",
    password: "12345",
    port: 5432,
});


pool.connect()
    .then(() => console.log("✅ Подключено к PostgreSQL"))
    .catch((err) => console.error("❌ Ошибка подключения:", err));


app.get("/all", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        f.last_name, 
        f.first_name, 
        f.middle_name, 
        c.name AS city, 
        p.height_cm, 
        p.weight_kg
      FROM player p
      JOIN full_name f ON p.full_name_id = f.id
      JOIN city c ON p.city_id = c.id
      ORDER BY f.last_name;
    `);
        res.json(result.rows);
    } catch (err) {
        console.error("Ошибка при загрузке всех игроков:", err);
        res.status(500).json({ error: "Ошибка сервера", details: err.message });
    }
});


app.get("/search", async (req, res) => {
    const { field, query } = req.query;
    if (!field || !query) {
        return res.status(400).json({ error: "Не указаны параметры поиска" });
    }

    let sqlField;
    if (["last_name", "first_name", "middle_name"].includes(field)) {
        sqlField = `f.${field}`;
    } else if (field === "city") {
        sqlField = `c.name`;
    } else {
        return res.status(400).json({ error: "Некорректное поле поиска" });
    }

    try {
        const result = await pool.query(
            `
      SELECT 
        f.last_name, 
        f.first_name, 
        f.middle_name, 
        c.name AS city, 
        p.height_cm, 
        p.weight_kg
      FROM player p
      JOIN full_name f ON p.full_name_id = f.id
      JOIN city c ON p.city_id = c.id
      WHERE ${sqlField} ILIKE $1
      ORDER BY f.last_name;
    `,
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Ошибка при поиске:", err);
        res.status(500).json({ error: "Ошибка сервера", details: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
