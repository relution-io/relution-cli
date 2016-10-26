"use strict";
var html = require('common-tags').html;
var ConnectionsReadme = (function () {
    function ConnectionsReadme() {
        this.name = 'connectionsreadme';
        this.parentFolder = 'connections';
        this.publishName = 'README.md';
        this.description = "\n    This folder contains definitions of the 3rd-tier backend servers used by the application.\n    ```bash\n      relution connections help\n    ```";
    }
    Object.defineProperty(ConnectionsReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionsReadme;
}());
exports.ConnectionsReadme = ConnectionsReadme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbnNSZWFkbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ2lpL3RlbXBsYXRlcy9uZXcvQ29ubmVjdGlvbnNSZWFkbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFekM7SUFBQTtRQUNTLFNBQUksR0FBVyxtQkFBbUIsQ0FBQztRQUNuQyxpQkFBWSxHQUFXLGFBQWEsQ0FBQztRQUNyQyxnQkFBVyxHQUFXLFdBQVcsQ0FBQztRQUNsQyxnQkFBVyxHQUFXLHdKQUlwQixDQUFDO0lBT1osQ0FBQztJQUxDLHNCQUFJLHVDQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFJLFVBQ1IsRUFBZ0IsUUFDbkIsb0NBRk8sSUFBSSxLQUNSLElBQUksQ0FBQyxXQUFXLEVBQ25CLENBQUMsQ0FBQzs7UUFDTCxDQUFDOzs7T0FBQTtJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7QUFmWSx5QkFBaUIsb0JBZTdCLENBQUEifQ==