module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "@components": "./src/components",
                        "@api": "./src/api",
                        "@utils": "./src/utils",
                        "@common": "./src/common",
                        "@parts": "./src/parts",
                        "@errors": "./src/errors",
                        "@hooks": "./src/hooks",
                        "@screens": "./src/screens",
                        "@navigation": "./src/navigation",
                    },
                },
            ],
        ],
    };
};
