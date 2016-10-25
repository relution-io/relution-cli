"use strict";
var PackageJson_1 = require('./PackageJson');
var html = require('common-tags').html;
var ModelReadme = (function () {
    function ModelReadme() {
        this.name = 'modelreadme';
        this.parentFolder = 'models';
        this.publishName = 'README.md';
        this.package = new PackageJson_1.PackageJson();
        this.description = "\n    This folder contains model definitions of the data managed by the backend application.\n    ```bash\n      relution model help\n    ```";
    }
    Object.defineProperty(ModelReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ModelReadme;
}());
exports.ModelReadme = ModelReadme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxSZWFkbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ2lpL3RlbXBsYXRlcy9uZXcvTW9kZWxSZWFkbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDRCQUEwQixlQUFlLENBQUMsQ0FBQTtBQUMxQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRXpDO0lBQUE7UUFDUyxTQUFJLEdBQVcsYUFBYSxDQUFDO1FBQzdCLGlCQUFZLEdBQVcsUUFBUSxDQUFDO1FBQ2hDLGdCQUFXLEdBQVcsV0FBVyxDQUFDO1FBQ2xDLFlBQU8sR0FBZ0IsSUFBSSx5QkFBVyxFQUFFLENBQUM7UUFDekMsZ0JBQVcsR0FBVywrSUFJcEIsQ0FBQztJQU9aLENBQUM7SUFMQyxzQkFBSSxpQ0FBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBSSxVQUNSLEVBQWdCLFFBQ25CLG9DQUZPLElBQUksS0FDUixJQUFJLENBQUMsV0FBVyxFQUNuQixDQUFDLENBQUM7O1FBQ0wsQ0FBQzs7O09BQUE7SUFDSCxrQkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQlksbUJBQVcsY0FnQnZCLENBQUEifQ==