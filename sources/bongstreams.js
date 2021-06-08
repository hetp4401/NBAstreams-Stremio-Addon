const rp = require("request-promise");
const { parse } = require("fast-html-parser");

function getTunnel(url) {
  return rp(url).then((body) => {
    const html = parse(body);
    const iframe = html.querySelector("iframe");
    const path = iframe.rawAttributes.src;
    const tunnel = "http://bongstreams.com" + path;

    return tunnel;
  });
}

function getLink(tunnel) {
  return rp(tunnel).then((body) => {
    const idx = body.indexOf('src : "') + 7;
    const idx2 = body.indexOf('"', idx);
    const link = body.substring(idx, idx2);
    return link;
  });
}

function getStream(url) {
  return getTunnel(url).then((tunnel) => getLink(tunnel));
}

module.exports = { getStream };
