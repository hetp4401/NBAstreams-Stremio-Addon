const express = require("express");
const addon = express();

const { getMatches } = require("./matches");

const MANIFEST = require("./manifest.json");
const META = require("./meta.json");

addon.listen(process.env.PORT || 7000, () => {
  console.log("Add-on Repository URL: http://127.0.0.1:7000/manifest.json");
});

addon.get("/manifest.json", function (req, res) {
  respond(res, MANIFEST);
});

addon.get("/meta/tv/:id.json", (req, res, next) => {
  respond(res, META);
});

addon.get("/catalog/:type/:NBA.json", async function (req, res, next) {
  const games = await getMatches();

  const metas = games.map((x) => {
    return {
      id: x.id,
      type: req.params.type,
      name: x.name,
    };
  });

  respond(res, { metas: metas });
});

addon.get("/stream/tv/:id.json", async (req, res, next) => {
  console.log(req.params.id);

  const id = req.params.id;
  const arr = id.substring(3).split(":");
  const game = arr[0];
  const title = arr[1];

  respond(res, { metas: [] });
});

function respond(res, data) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");
  res.send(data);
}
