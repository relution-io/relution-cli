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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRpdG9yQ29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L0VkaXRvckNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV6QztJQUFBO1FBQ1MsZ0JBQVcsR0FBVyxlQUFlLENBQUM7UUFDdEMsU0FBSSxHQUFXLGNBQWMsQ0FBQztJQW1CdkMsQ0FBQztJQWpCQyxzQkFBVyxrQ0FBUTthQUFuQjtZQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQUkscVJBYVgscVNBYk8sSUFBSSxLQWFYLENBQUMsQ0FBQzs7UUFDTCxDQUFDOzs7T0FBQTtJQUVILG1CQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQztBQXJCWSxvQkFBWSxlQXFCeEIsQ0FBQSJ9