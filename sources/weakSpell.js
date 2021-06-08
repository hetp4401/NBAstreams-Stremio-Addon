const rp = require("request-promise");

function getKey(link) {
  return rp(link).then((body) => {
    const idx = body.indexOf('var vidgstream = "') + 18;
    const idx2 = body.indexOf('"', idx);
    const key = body.substring(idx, idx2).replace("+", "%2B");
    return key;
  });
}

function getLink(key) {
  return rp(`http://liveonscore.tv/gethls.php?idgstream=${key}`).then(
    (body) => {
      const json = JSON.parse(body);
      const link = json.rawUrl;
      return link;
    }
  );
}

function getStream(url) {
  return getKey(url).then((key) => getLink(key));
}

module.exports = { getStream };
