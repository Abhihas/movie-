const express = require("express");
const app = express();
let sqlite3 = require("sqlite3");
let path = require("path");
let { open } = require("sqlite");
let db = null;

let dbpath = path.join(__dirname, "moviesData.db");
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
 movie;
 order by
 movie_id`;
  const playersArray = await db.all(getPlayersQuery);

  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
