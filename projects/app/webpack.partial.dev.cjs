const { mergeWithCustomize, unique } = require("webpack-merge");
const webpack = require("webpack");

exports.default = {
    // Allow for inline-sourcemaps
    config: function (cfg) {
        const merged = mergeWithCustomize({
            customizeArray: unique("plugins", ["SourceMapDevToolPlugin"], (plugin) => plugin.constructor && plugin.constructor.name),
        })(cfg, {
            // by not defining plugin options, the plugin defaults to inline-sourcemaps
            plugins: [new webpack.SourceMapDevToolPlugin()],
        });

        // Allow for .js and .mjs extensions to be resolved
        merged.resolve.extensionAlias = {
            ".js": [".ts", ".js"],
            ".mjs": [".mts", ".mjs"],
        };
        return merged;
    },
};
