// A collection of hacks that attempts to do as much sanity checking
// of the code in the source for a chapter as possible, without
// requiring excessive annotation.

var fs = require("fs");
var acorn = require("acorn");

var file = process.argv[2];
var input = fs.readFileSync(file, "utf8");

var code = "var alert = function() {}, prompt = function() { return 'x'; }, confirm = function() { return true; };\n";

var include = /\n:load_files: (\[[^\]]+\])/.exec(input);
if (include) JSON.parse(include[1]).forEach(function(fileName) {
  var text = fs.readFileSync("html/" + fileName);
  if (!/\/\/ test: no/.test(text))
    code += text;
});

function wrapTestOutput(snippet, config) {
  var output = "", m, re = /\/\/ → (.*\n)((?:\/\/   .*\n)*)/g;
  while (m = re.exec(snippet)) {
    output += m[1];
    if (m[2]) output += m[2].replace(/\/\/   /g, "");
  }
  return "console.clear();\n" + snippet + "console.verify(" + JSON.stringify(output) + ", " + JSON.stringify(config) + ");\n";
}

function pos(index) {
  return "line " + (input.slice(0, index).split("\n").length + 1);
}

var re = /((?:\/\/.*\n|\s)*)\[source,javascript\]\n----\n([\s\S]*?\n)----/g, m;
while (m = re.exec(input)) {
  var snippet = m[2], hasConf = m[1].match(/\/\/ test: (.*)/), config = hasConf ? hasConf[1] : "";
  var where = pos(m.index);
  try {
    acorn.parse(snippet);
  } catch(e) {
    console.log("parse error at " + where + ": " + e.toString());
  }
  if (/\bno\b/.test(config)) continue;
  if (/\/\/ →/.test(snippet)) snippet = wrapTestOutput(snippet, config);
  if (/\bwrap\b/.test(config)) snippet = "(function(){\n" + snippet + "}());\n";
  code += "console.pos = " + JSON.stringify(where) + ";\n";
  code += snippet;
}

function represent(val) {
  if (typeof val == "boolean") return String(val);
  if (typeof val == "number") return String(val);
  if (typeof val == "string") return JSON.stringify(val);
  if (val == null) return String(val);
  if (Array.isArray(val)) return representArray(val);
  else return representObj(val);
}

function representArray(val) {
  var out = "[";
  for (var i = 0; i < val.length; ++i) {
    if (i) out += ", ";
    out += represent(val[i]);
    if (out.length > 80) return out;
  }
  return out + "]";
}

function representObj(val) {
  var string = val.toString(), m, elt;
  if (/^\[object .*\]$/.test(string))
    return representSimpleObj(val);
  if (val.call && (m = string.match(/^\s*(function[^(]*\([^)]*\))/)))
    return m[1] + "{…}";
  return string;
}

function constructorName(obj) {
  if (!obj.constructor) return null;
  var m = String(obj.constructor).match(/^function\s*([^\s(]+)/);
  if (m && m[1] != "Object") return m[1];
}

function hop(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function representSimpleObj(val) {
  var out = "{", name = constructorName(val);
  if (name) out = name + " " + out;
  var first = true;
  for (var prop in val) if (hop(val, prop)) {
    if (out.length > 80) return out;
    if (first) first = false;
    else out += ", ";
    out += prop + ": " + represent(val[prop]);
  }
  return out + "}";
}

function compareClipped(a, b) {
  a = a.split("\n");
  b = b.split("\n");
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    var len = Math.max(0, a[i].length - 1);
    if (a[i].slice(0, len) != b[i].slice(0, len)) return false;
  }
  return true;
}

function compareJoined(a, b) {
  return a.replace(/\n\s*/g, " ").trim() == a.replace(/\n\s*/g, " ").trim();
}

var accum = "", _console = {
  clear: function() { accum = ""; },
  log: function() {
    for (var i = 0; i < arguments.length; i++) {
      if (i) accum += " ";
      if (typeof arguments[i] == "string")
        accum += arguments[i];
      else
        accum += represent(arguments[i]);
    }
    accum += "\n";
  },
  verify: function(string, config) {
    var clip = string.indexOf("…"), ok = false;
    if (/\btrailing\b/.test(config)) accum = accum.replace(/\s+(\n|$)/g, "$1");
    if (/\btrim\b/.test(config)) { accum = accum.trim(); string = string.trim(); }
    if (/\bclip\b/.test(config)) ok = compareClipped(string, accum);
    else if (/\bjoin\b/.test(config)) ok = compareJoined(string, accum);
    else if (clip > -1) ok = string.slice(0, clip) == accum.slice(0, clip);
    else ok = string == accum;
    if (!ok)
      console.log("mismatch at " + this.pos + ". got:\n" + accum + "\nexpected:\n" + string);
  },
  pos: null
};

try {
  (new Function("console", code))(_console);
} catch(e) {
  console.log("error raised (" + _console.pos + "): " + e.toString());
}
