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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5kZXhIdG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L0luZGV4SHRtbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNEJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBQzFDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFekM7SUFBQTtRQUNTLFNBQUksR0FBVyxZQUFZLENBQUM7UUFDNUIsaUJBQVksR0FBVyxLQUFLLENBQUM7UUFDN0IsZ0JBQVcsR0FBVyxZQUFZLENBQUM7UUFDbkMsWUFBTyxHQUFnQixJQUFJLHlCQUFXLEVBQUUsQ0FBQztJQWtCbEQsQ0FBQztJQWhCQyxzQkFBSSwrQkFBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBSSx1RkFJRyxFQUFTLDJEQUdaLEVBQVMsb0NBRVgsRUFBd0IsMERBSWpDLHNRQWJPLElBQUksS0FJRyxJQUFJLENBQUMsSUFBSSxFQUdaLElBQUksQ0FBQyxJQUFJLEVBRVgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBSWpDLENBQUMsQ0FBQzs7UUFDTCxDQUFDOzs7T0FBQTtJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSxpQkFBUyxZQXNCckIsQ0FBQSJ9