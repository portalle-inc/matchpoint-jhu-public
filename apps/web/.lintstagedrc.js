const path = require("node:path");
const base = require("../../.lintstagedrc.js");


const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  ...base,
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
