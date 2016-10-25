"use strict";
var html = require('common-tags').html;
var EnvReadme = (function () {
    function EnvReadme() {
        this.name = 'envreadme';
        this.parentFolder = 'env';
        this.publishName = 'README.md';
        this.description = "\n    This folder contains configuration data of different deployment environments.\n    ```bash\n      relution env help\n    ```";
    }
    Object.defineProperty(EnvReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return EnvReadme;
}());
exports.EnvReadme = EnvReadme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52UmVhZG1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L0VudlJlYWRtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV6QztJQUFBO1FBQ1MsU0FBSSxHQUFXLFdBQVcsQ0FBQztRQUMzQixpQkFBWSxHQUFXLEtBQUssQ0FBQztRQUM3QixnQkFBVyxHQUFXLFdBQVcsQ0FBQztRQUNsQyxnQkFBVyxHQUFXLG9JQUlwQixDQUFDO0lBT1osQ0FBQztJQUxDLHNCQUFJLCtCQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFJLFVBQ1IsRUFBZ0IsUUFDbkIsb0NBRk8sSUFBSSxLQUNSLElBQUksQ0FBQyxXQUFXLEVBQ25CLENBQUMsQ0FBQzs7UUFDTCxDQUFDOzs7T0FBQTtJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7QUFmWSxpQkFBUyxZQWVyQixDQUFBIn0=