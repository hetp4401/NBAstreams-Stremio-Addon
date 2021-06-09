const rp = require("request-promise");
const { parse } = require("fast-html-parser");

const sourceFuncs = {
  topstreamer: require("./sources/topstreamer").getStream,
  givemeredditstream: require("./sources/givemeredditstream").getStream,
  BongStreams: require("./sources/bongstreams").getStream,
};

function getSource(source) {
  const { tunnel, name } = source;

  return rp(tunnel)
    .then((body) => {
      const html = parse(body);
      const url = html.querySelector("#skip-btn").rawAttributes.href;
      return url;
    })
    .then((url) => sourceFuncs[name](url))
    .catch((err) => {});
}

function getStreams(id) {
  return rp(
    `https://sportscentral.io/streams-table/${id}/basketball?new-ui=1&origin=nbastreams.to`
  )
    .then((body) => {
      const html = parse(body);
      const tbody = html.querySelector("tbody");
      const tr = tbody.querySelectorAll("tr").slice(1);

      const sources = tr.map((x) => {
        const tunnel = x.rawAttributes["data-stream-link"];
        const name = x.querySelector(".first").rawText.trim();
        return { tunnel: tunnel, name: name };
      });

      const filtered = sources.filter((x) => x.name in sourceFuncs);
      const streams = Promise.all(filtered.map((x) => getSource(x)));

      console.log(streams);
      console.log();

      return streams;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

module.exports = { getStreams };
