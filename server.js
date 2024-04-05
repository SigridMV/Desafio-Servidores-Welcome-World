const express = require("express");
const app = express();
const fs = require("fs").promises;

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Ruta para crear un archivo
app.get("/crear", async (req, res) => {
  const { archivo, contenido } = req.query;
  const fecha = obtenerFechaActual();
  const nombreArchivo = `${archivo}.txt`;
  try {
    await fs.writeFile(nombreArchivo, `${fecha}\n${contenido}`, "utf8");
    res.send(
      `<script>alert("El archivo ha sido creado con éxito"); window.location.href='/';</script>`
    );
  } catch (error) {
    res.status(500).send("Algo salió mal...");
    console.log(error);
  }
});

// Ruta para leer un archivo
app.get("/leer", async (req, res) => {
  const { archivo } = req.query;
  try {
    const data = await fs.readFile(`${archivo}.txt`, "utf8");
    res.send(data);
  } catch (error) {
    res.status(500).send("Algo salió mal al leer el archivo...");
    console.error(error);
  }
});

// Ruta para renombrar un archivo
app.get("/renombrar", async (req, res) => {
  const { archivo, nuevoNombre } = req.query;
  try {
    console.log('Nombre del archivo actual:', archivo);
    await fs.rename(`${archivo}.txt`, `${nuevoNombre}.txt`);
    res.send(`El archivo -- ${archivo} -- ha sido renombrado por -- ${nuevoNombre} --`);
  } catch (error) {
    res.status(500).send("Algo salió mal al renombrar el archivo...");
    console.error(error);
  }
});

// Ruta para eliminar un archivo
app.get("/eliminar", async (req, res) => {
  const { archivo } = req.query;
  try {
    await fs.unlink(`${archivo}.txt`); 
    res.send(`Archivo ${archivo} eliminado con éxito`);
  } catch (error) {
    res.status(500).send("Algo salió mal al eliminar el archivo...");
    console.error(error);
  }
});

function obtenerFechaActual() {
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

app.get("*", (req, res) => {
  res.send("<center><h1>Esta página no existe...</h1></center>");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
