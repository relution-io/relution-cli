"use strict";
var PackageJson = (function () {
    function PackageJson() {
        this.name = 'app';
    }
    Object.defineProperty(PackageJson.prototype, "template", {
        get: function () {
            return ("\n{\n  \"name\": \"" + name + "\",\n  \"version\": \"0.0.1\",\n  \"main\": \"app.js\",\n  \"dependencies\": {\n  },\n  \"devDependencies\": {\n  },\n  \"relution\": {}\n}\n");
        },
        enumerable: true,
        configurable: true
    });
    return PackageJson;
}());
exports.PackageJson = PackageJson;
//# sourceMappingURL=PackageJson.js.map