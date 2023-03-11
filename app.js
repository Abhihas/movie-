const express = require("express");

const app = express();
let sqlite3 = require("sqlite3");
let path = require("path");
let { open } = require("sqlite");
let db = null;

let dbpath = path.join(__dirname, "movieData.db");
let initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("server started");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

initializeDBAndServer();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

//get
app.get("/movies/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 movie;`;
  const playersArray = await db.all(getPlayersQuery);

  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
const convertDbObjectToResponse = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//get particular id
app.get("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  let getSqlQuery = `
    SELECT * FROM movie WHERE movie_id=${movieId};`;
  let array = await db.get(getSqlQuery);
  response.send(convertDbObjectToResponse(array));
});

app.use(express.json());

//post
app.post("/movies/", async (request, response) => {
  let bodyDetails = request.body;
  let { directorId, movieName, leadActor } = bodyDetails;
  let getSql = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (
        '${directorId}',
         ${movieName},
         '${leadActor}'
      );`;

  let dbRes = await db.run(getSql);

  response.send("Movie Successfully Added");
});

//put
app.put("/movies/:movieId/", async (request, response) => {
  const bookDetails = request.body;
  let { movieId } = request.params;
  const { directorId, movieName, leadActor } = bookDetails;

  const updateBookQuery = `
    UPDATE
      movie
    SET
      director_id='${directorId}',
      movie_name=${movieName},
      lead_actor='${leadActor}'
    WHERE
      movie_id = ${playerId};`;
  let book_Of = await db.run(updateBookQuery);
  response.send("Movie Details Updated");
});

//detete
app.delete("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;

  const deleteBookQuery = `
    DELETE FROM
        movie
    WHERE
        movie_id = ${movieId};`;
  let book_Of = await db.run(deleteBookQuery);
  response.send("Movie Removed");
});

module.exports = app;

