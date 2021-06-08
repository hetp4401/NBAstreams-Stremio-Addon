const rp = require("request-promise");
const { parse } = require("fast-html-parser");

function getTunnel(link) {
  return rp(link).then((body) => {
    const html = parse(body);
    const iframe = html.querySelectorAll(".embed-responsive-item")[1];
    const tunnel = iframe.rawAttributes.src;
    return tunnel;
  });
}

function getLink(tunnel) {
  return rp(tunnel).then((body) => {
    const idx = body.indexOf("source: '") + 9;
    const idx2 = body.indexOf("'", idx);
    const link = body.substring(idx, idx2);
    return link;
  });
}

function getStream(url) {
  return getTunnel(url).then((tunnel) => getLink(tunnel));
}

module.exports = { getStream };
