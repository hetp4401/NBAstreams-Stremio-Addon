const rp = require("request-promise");
const { parse } = require("fast-html-parser");

const sourceFuncs = {
  Weak_Spell: require("./sources/weakSpell").getStream,
};

function getSource(source) {
  const { tunnel, name } = source;

  return rp(tunnel)
    .then((body) => {
      const html = parse(body);
      const url = html.querySelector("#skip-btn").rawAttributes.href;
      return url;
    })
    .then((url) => sourceFuncs[name](url));
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
      return streams;
    })
    .catch((err) => []);
}

module.exports = { getStreams };
