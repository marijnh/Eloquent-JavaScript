var fs = require("fs"), path = require("path");

var images = [];
function scanDir(dir) {
  fs.readdirSync(dir).forEach(function(file) {
    var full = path.resolve(dir, file), type;
    if (fs.lstatSync(full).isDirectory())
      return scanDir(full);
    if (/\.svg$/.test(file))
      type = "image/svg+xml";
    else if (/\.png$/.test(file))
      type = "image/png";
    else if (/\.jpg$/.test(file))
      type = "image/jpeg";
    else
      throw new Error("Unknown image type: " + full);
    var local = full.slice(full.indexOf("/img/") + 1);
    images.push("    <item id=\"image." + file + "\" href=\"" + local + "\" media-type=\"" + type + "\"/>");
  });
}
scanDir("epub/img");

var out = fs.readFileSync("epub/content.opf.src", "utf8").replace("{{images}}", images.join("\n"));
fs.writeFileSync("epub/content.opf", out);
