const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

///
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
        SELECT *
        FROM movie
    ;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

///
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `
        INSERT INTO
            movie (director_id, movie_name, lead_Actor)
        VALUES (
            ${directorId},
            '${movieName}',
            '${leadActor}'
        );`;
  const dbResponse = db.run(postMovieQuery);
  response.send("Movie Added Successfully");
});

///
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
        SELECT 
            *
        FROM
            movie
        WHERE
            movie_id = ${movieId}
        ;`;
  const movieArray = await db.get(getMovieQuery);
  response.send(movieArray);
});

///
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
        UPDATE
            movie
        SET 
            director_id=${directorId},
            movie_name='${movieName}',
            lead_actor='${leadActor}'
        ;`;
  const dbResponse = await db.run(updateMovieQuery);
  response.send("Movie Updated Successfully");
});

///
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
        DELETE FROM movie
        WHERE movie_id = ${movieId}
    ;`;
  const dbResponse = await db.run(deleteMovieQuery);
  response.send("Movie Deleted Successfully");
});

///
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
        SELECT
            *
        FROM
            director
        ;`;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(directorsArray);
});

///
app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovieQuery = `
            SELECT
                *
            FROM
                movie
            WHERE director_id = ${directorId}
        ;`;
  const directorMovieArray = await db.all(getDirectorMovieQuery);
  response.send(directorMovieArray);
});
