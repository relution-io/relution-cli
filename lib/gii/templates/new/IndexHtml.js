"use strict";
var PackageJson_1 = require('./PackageJson');
var html = require('common-tags').html;
var IndexHtml = (function () {
    function IndexHtml() {
        this.name = 'index.html';
        this.parentFolder = 'www';
        this.publishName = 'index.html';
        this.package = new PackageJson_1.PackageJson();
    }
    Object.defineProperty(IndexHtml.prototype, "template", {
        get: function () {
            return ((_a = ["\n      <html>\n        <head>\n          <meta charset=\"utf-8\">\n          <title>", "</title>\n        </head>\n        <body>\n          <h1>", "</h1>\n          <p>\n            ", "\n          </p>\n        </body>\n      </script>\n    "], _a.raw = ["\n      <html>\n        <head>\n          <meta charset=\"utf-8\">\n          <title>", "</title>\n        </head>\n        <body>\n          <h1>", "</h1>\n          <p>\n            ", "\n          </p>\n        </body>\n      </script>\n    "], html(_a, this.name, this.name, this.package.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return IndexHtml;
}());
exports.IndexHtml = IndexHtml;
//# sourceMappingURL=IndexHtml.js.map