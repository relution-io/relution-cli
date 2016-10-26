"use strict";
var html = require('common-tags').html;
var PushReadme = (function () {
    function PushReadme() {
        this.name = 'pushreadme';
        this.parentFolder = 'push';
        this.publishName = 'README.md';
        this.description = "\n    This folder contains push service metadata used by the backend application.\n    ```bash\n      relution push help\n    ```";
    }
    Object.defineProperty(PushReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return PushReadme;
}());
exports.PushReadme = PushReadme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaFJlYWRtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9naWkvdGVtcGxhdGVzL25ldy9QdXNoUmVhZG1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRXpDO0lBQUE7UUFDUyxTQUFJLEdBQVcsWUFBWSxDQUFDO1FBQzVCLGlCQUFZLEdBQVcsTUFBTSxDQUFDO1FBQzlCLGdCQUFXLEdBQVcsV0FBVyxDQUFDO1FBQ2xDLGdCQUFXLEdBQVcsbUlBSXBCLENBQUM7SUFPWixDQUFDO0lBTEMsc0JBQUksZ0NBQVE7YUFBWjtZQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQUksVUFDUixFQUFnQixRQUNuQixvQ0FGTyxJQUFJLEtBQ1IsSUFBSSxDQUFDLFdBQVcsRUFDbkIsQ0FBQyxDQUFDOztRQUNMLENBQUM7OztPQUFBO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBZkQsSUFlQztBQWZZLGtCQUFVLGFBZXRCLENBQUEifQ==