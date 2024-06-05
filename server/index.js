const express = require("express");
const app = express();
require("dotenv").config();

const database = require("./db");
const Actor = require("./models/Actor.js");
const Papel = require("./models/Papel.js");

const PORT = process.env.PORT || 3001;
app.use(express.json());

// Backend, renderizar actores con paginado, Mostrar toda la información de un actor (documentación Swagger), 10 actores en la bd, y solamente enviar 3
// ?pagination=1 -> [1, 2, 3]

app.get("/actores", async (req, res) => {
  try {
    const getActor = await Actor.findAll({
      include: {
        model: Papel,
        attributes: ["nombre"],
        through: {
          attributes: [],
        },
      },
    });

    res.status(200).json(getActor);
  } catch (err) {
    console.log("Ocurrio un error al traer los Actores " + err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/actores", async (req, res) => {
  try {
    const { nombre, apellido, altura, edad, foto, papeles } = req.body;
    const newActor = await Actor.create({
      nombre,
      apellido,
      altura,
      edad,
      foto,
    });
    newActor.addPapels(papeles);
    res.status(201).json(newActor);
  } catch (err) {
    console.log("Ocurrio un error al traer los Actores " + err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/papeles", async (req, res) => {
  try {
    const getPapel = await Papel.findAll();
    res.status(200).json(getPapel);
  } catch (err) {
    console.log("Ocurrio un error al traer los Actores " + err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/papeles", async (req, res) => {
  try {
    const { nombre } = req.body;
    const newPapel = await Papel.create({ nombre });
    res.status(201).json(newPapel);
  } catch (err) {
    console.log("Ocurrio un error al traer los Actores " + err);
    res.status(500).send("Internal Server Error");
  }
});

const start = async () => {
  try {
    await database.authenticate();

    Actor.belongsToMany(Papel, { through: "ActorPapel" });
    Papel.belongsToMany(Actor, { through: "ActorPapel" });

    await database.sync({ alter: true }); // Crear tablas

    const actoresDB = await Actor.findAll();
    const papelesDb = await Papel.findAll();

    const actoresPapeles = [
      {
        ActorId: 1,
        PapelId: 1,
      },
      {
        ActorId: 1,
        PapelId: 2,
      },
      {
        ActorId: 2,
        PapelId: 1,
      },
      {
        ActorId: 2,
        PapelId: 2,
      },
      {
        ActorId: 2,
        PapelId: 4,
      },
      {
        ActorId: 3,
        PapelId: 1,
      },
      {
        ActorId: 4,
        PapelId: 1,
      },
      {
        ActorId: 4,
        PapelId: 2,
      },
      {
        ActorId: 4,
        PapelId: 3,
      },
      {
        ActorId: 5,
        PapelId: 5,
      },
      {
        ActorId: 6,
        PapelId: 3,
      },
      {
        ActorId: 7,
        PapelId: 2,
      },
      {
        ActorId: 7,
        PapelId: 5,
      },
      {
        ActorId: 8,
        PapelId: 2,
      },
    ];

    if (!actoresDB.length && !papelesDb.length) {
      const response = await fetch(
        "https://api-actores-production.up.railway.app/actores"
      );
      const { data: actoresJson } = await response.json();

      await Actor.bulkCreate(actoresJson);

      const responsePapel = await fetch(
        "https://api-actores-production.up.railway.app/papeles"
      );
      const { data: papelJson } = await responsePapel.json();

      const transfJson = papelJson.map((papel) => {
        return papel === "Protaginista"
          ? { nombre: "Principal" }
          : { nombre: papel };
      });

      await Papel.bulkCreate(transfJson);

      for (let actorPapel of actoresPapeles) {
        const actor = await Actor.findByPk(actorPapel.ActorId);
        const papel = await Papel.findByPk(actorPapel.PapelId);
        await actor.addPapels(papel);
      }

      //   for (let i = 0; i < actoresPapeles.length; i++) {
      //     actoresPapeles[i].ActorId
      //     actoresPapeles[i].PapelId

      //     const actor = await Actor.findByPk(actoresPapeles[i].ActorId);
      //     const papel = await Papel.findByPk(actoresPapeles[i].PapelId);

      //     await actor.addPapels(papel);
      //   }
    }

    app.listen(PORT, () => {
      console.log("Escuchando en el puerto: " + PORT);
    });
  } catch (err) {
    console.log("Ocurrio un error" + err);
  }
};

start();
