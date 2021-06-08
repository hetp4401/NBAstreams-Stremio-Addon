const rp = require("request-promise");

function getStream(url) {
  return rp(url).then((body) => {
    const kidx = body.indexOf("key= '") + 6;
    const kidx2 = body.indexOf("'", kidx);
    const key = body.substring(kidx, kidx2);

    const sidx = body.indexOf("server='") + 8;
    const sidx2 = body.indexOf("'", sidx);
    const server = body.substring(sidx, sidx2);

    const link = `https://${server}/${key}.m8`;

    return link;
  });
}

module.exports = { getStream };
