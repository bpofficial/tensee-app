module.exports = {
    preset: "jest-expo",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    },
    transformIgnorePatterns: [
        "node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?|@unimodules|unimodules|@react-navigation|react-navigation|@rneui)",
    ],
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
    testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
