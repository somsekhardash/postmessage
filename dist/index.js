"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMessenger = void 0;
var PostMessenger = /** @class */ (function () {
    function PostMessenger(config) {
        this.receiveEventTypes = [];
        this.sendEventTypes = [];
        this.appName = config.appName;
        this.receiveEventTypes = config.receiveEventTypes;
        this.sendEventTypes = config.sendEventTypes;
        window.addEventListener("message", this.listenMessage.bind(this), false);
    }
    PostMessenger.prototype.findType = function (typeArray, type) {
        return typeArray.indexOf(type) !== -1;
    };
    PostMessenger.prototype.postMessage = function (message, iframeId) {
        console.log("POST-MSG", message);
        try {
            if (!!iframeId) {
                try {
                    var getElement = document.getElementById(iframeId);
                    this.findType(this.sendEventTypes, message.type) &&
                        getElement &&
                        getElement.contentWindow.postMessage(message, "*");
                }
                catch (error) {
                    console.error("Can't send this type as its not registered", error);
                }
            }
            else {
                try {
                    this.findType(this.sendEventTypes, message.type) &&
                        window.parent.postMessage(message, "*");
                }
                catch (error) {
                    console.error("Error while posting message to parent!!! ", error);
                }
            }
        }
        catch (error) {
            console.error("error in postMessage", error);
        }
    };
    PostMessenger.prototype.listenMessage = function (event) {
        try {
            var data_1 = event.data;
            if (this.findType(this.receiveEventTypes.map(function (eventType) { return eventType.type; }), data_1.type)) {
                console.log("RECEIVE-MSG", event.data);
                var receiveEventType = this.receiveEventTypes.find(function (eventType) { return eventType.type === data_1.type; });
                receiveEventType.callBack(data_1);
            }
        }
        catch (error) {
            console.error("error in listenMessage", error);
        }
    };
    return PostMessenger;
}());
exports.PostMessenger = PostMessenger;
//# sourceMappingURL=index.js.map