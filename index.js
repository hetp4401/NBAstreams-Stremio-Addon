const express = require("express");
const addon = express();

const cacheManager = require("cache-manager");
const cache = cacheManager.caching({
  store: "memory",
});

const { getMatches } = require("./matches");
const { getStreams } = require("./streams");

const MANIFEST = require("./manifest.json");
const META = require("./meta.json");

addon.listen(process.env.PORT || 7000, () => {
  console.log("Add-on Repository URL: http://127.0.0.1:7000/manifest.json");
});

addon.get("/", (req, res) => {
  res.send("Stremio NBAstreams Add-on API");
});

addon.get("/manifest.json", (req, res) => {
  respond(res, MANIFEST);
});

addon.get("/meta/:type/:id.json", (req, res) => {
  respond(res, META);
});

addon.param("type", function (req, res, next, val) {
  if (MANIFEST.types.includes(val)) {
    next();
  } else {
    next("Unsupported type " + val);
  }
});

addon.get("/catalog/:type/:id.json", (req, res) => {
  cache
    .wrap("catalog", () => getMatches(), { ttl: 60 * 60 * 6 })
    .then((games) => {
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

addon.get("/stream/:type/:id.json", (req, res) => {
  const id = req.params.id;
  const arr = id.split(":");
  const game = arr[1];
  const title = arr[2];

  cache
    .wrap(game, () => getStreams(game), { ttl: 60 * 15 })
    .then((streams) => {
      console.log(streams);
      respond(res, {
        streams: streams.map((x) => ({
          name: "NBAstreams",
          title: title,
          url: x,
        })),
      });
    });
});

function respond(res, data) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");
  res.send(data);
}
