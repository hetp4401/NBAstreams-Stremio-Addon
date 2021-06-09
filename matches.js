const rp = require("request-promise");

function getDate() {
  const d = new Date();
  d.setHours(d.getHours() - 7);
  const date = d.toISOString().split("T")[0];
  return date;
}

function getTime(startTimestamp) {
  const d = new Date((parseInt(startTimestamp) - 14400) * 1000);
  const time = `${d.getUTCHours() % 12}:${
    d.getUTCMinutes() == 0 ? "00" : d.getUTCMinutes()
  }`;
  return time;
}

function getMatches() {
  return rp(`https://sportscentral.io/api/nba-tournaments?date=${getDate()}`)
    .then((body) => {
      const json = JSON.parse(body);
      const nba = json[0];
      const events = nba.events;
      const filtered = events.filter((x) => x.status.type != "finished");

      const live = [];
      filtered.forEach((x) => {
        live.push({
          name: `${x.name} @ ${getTime(x.startTimestamp)}PM EST`,
          id: `nba:${x.id}:${x.name}`,
        });
      });
      return live;
    })
    .catch((err) => []);
}

getMatches().then((matches) => {
  console.log(matches);
});

module.exports = { getMatches };
