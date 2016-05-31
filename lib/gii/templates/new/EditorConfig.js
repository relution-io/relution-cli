"use strict";
var html = require('common-tags').html;
var EditorConfig = (function () {
    function EditorConfig() {
        this.publishName = '.editorconfig';
        this.name = 'editorconfig';
    }
    Object.defineProperty(EditorConfig.prototype, "template", {
        get: function () {
            return ((_a = ["\n      # http://editorconfig.org\n      root = true\n\n      [*]\n      indent_style = space\n      indent_size = 2\n      charset = utf-8\n      trim_trailing_whitespace = true\n      insert_final_newline = true\n\n      [*.md]\n      trim_trailing_whitespace = false\n    "], _a.raw = ["\n      # http://editorconfig.org\n      root = true\n\n      [*]\n      indent_style = space\n      indent_size = 2\n      charset = utf-8\n      trim_trailing_whitespace = true\n      insert_final_newline = true\n\n      [*.md]\n      trim_trailing_whitespace = false\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return EditorConfig;
}());
exports.EditorConfig = EditorConfig;
//# sourceMappingURL=EditorConfig.js.map