// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});
const customJestConfig = {
    roots: ["<rootDir>"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    testPathIgnorePatterns: ["node_modules/"],
};
module.exports = createJestConfig(customJestConfig);
