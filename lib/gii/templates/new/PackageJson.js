"use strict";
var PackageJson = (function () {
    function PackageJson() {
        this.publishName = 'package.json';
        this.name = 'app';
        this.version = '0.0.1';
    }
    Object.defineProperty(PackageJson.prototype, "template", {
        get: function () {
            return ("\n{\n  \"name\": \"" + this.name + "\",\n  \"version\": \"" + this.version + "\",\n  \"main\": \"app.js\",\n  \"dependencies\": {\n  },\n  \"devDependencies\": {\n  },\n  \"relution\": {}\n}\n\n").trim();
        },
        enumerable: true,
        configurable: true
    });
    return PackageJson;
}());
exports.PackageJson = PackageJson;
//# sourceMappingURL=PackageJson.js.map