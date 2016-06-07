"use strict";
var CallModel = (function () {
    function CallModel(connectionId, outputModel, name, inputModel, action) {
        this.connectionId = connectionId;
        this.outputModel = outputModel;
        this.name = name;
        this.inputModel = inputModel;
        this.action = action;
    }
    return CallModel;
}());
exports.CallModel = CallModel;
//# sourceMappingURL=CallModel.js.map