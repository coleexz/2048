const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./leaderboard.db", (err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos SQLite");
    }
});

// Crear la tabla si no existe
db.run(
  `CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    ig TEXT UNIQUE,
    score INTEGER NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error("Error al crear la tabla leaderboard:", err);
    } else {
      console.log("Tabla leaderboard verificada/creada correctamente");
    }
  }
);


// Ruta para guardar la puntuación
app.post("/save-score", (req, res) => {
    const { name, ig, score } = req.body;

    if (!name || !ig || score === undefined) {
        console.error("Datos incompletos recibidos:", req.body);
        return res.status(400).json({ error: "Faltan datos" });
    }

    const query = `INSERT INTO leaderboard (name, ig, score) VALUES (?, ?, ?)`;
    db.run(query, [name, ig, score], function (err) {
        if (err) {
            console.error("Error al guardar la puntuación:", err);
            return res.status(500).json({ error: "Error al guardar la puntuación" });
        }
        res.json({ message: "Puntuación guardada correctamente" });
    });
});

app.get("/leaderboard", (req, res) => {
    const query = "SELECT name, ig, score FROM leaderboard ORDER BY score DESC";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error al obtener el leaderboard:", err);
            return res.status(500).json({ error: "Error al obtener el leaderboard" });
        }
        console.log("Datos del leaderboard:", rows); // Para verificar qué se obtiene
        res.json(rows);
    });
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
