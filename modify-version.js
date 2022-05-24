const fs = require("fs");
const path = require("path");

const package = JSON.parse(fs.readFileSync("package.json"))
const version = process.argv[2]
if (version == null) {
    throw "Specify version."
}

package.version = version
fs.writeFileSync(
    "package.json",
    JSON.stringify(package, null, 2)
)
