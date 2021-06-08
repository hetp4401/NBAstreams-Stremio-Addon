const express = require("express");
const addon = express();

const { getMatches } = require("./matches");
const { getStreams } = require("./streams");

const MANIFEST = require("./manifest.json");
const META = require("./meta.json");

addon.listen(process.env.PORT || 7000, () => {
  console.log("Add-on Repository URL: http://127.0.0.1:7000/manifest.json");
});

addon.get("/manifest.json", (req, res) => {
  respond(res, MANIFEST);
});

addon.get("/meta/tv/:id.json", (req, res) => {
  respond(res, META);
});

addon.get("/catalog/tv/:id.json", (req, res) => {
  getMatches().then((games) => {
    respond(res, {
      metas: games.map((x) => {
        return {
          id: x.id,
          type: req.params.type,
          name: x.name,
        };
      }),
    });
  });
});

addon.get("/stream/tv/:id.json", (req, res) => {
  const id = req.params.id;
  const arr = id.split(":");
  const game = arr[1];
  const title = arr[2];

  getStreams(game).then((streams) => {
    respond(
      res,
      streams.map((x) => ({ name: "NBAstreams", title: title, url: x }))
    );
  });
});

function respond(res, data) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");
  res.send(data);
}
