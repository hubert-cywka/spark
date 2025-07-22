export default {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    testRegex: ".*\\.integration\\.test\\.ts$",
    transform: {
        "^.+\\.(ts|js)$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(ts|js)"],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
};
