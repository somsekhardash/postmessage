export interface Message {
  type: string;
  value: any;
  from: string;
}

export interface Handler {
  type: string;
  callBack: (data?: any) => void;
}

interface IConfig {
  appName: string;
  receiveEventTypes: Handler[];
  sendEventTypes: string[];
}

export class PostMessenger {
  private appName: string;
  private receiveEventTypes: Handler[] = [];
  private sendEventTypes: string[] = [];

  constructor(config: IConfig) {
    this.appName = config.appName;
    this.receiveEventTypes = config.receiveEventTypes;
    this.sendEventTypes = config.sendEventTypes;
    window.addEventListener("message", this.listenMessage.bind(this), false);
  }

  findType(typeArray: string[], type: string) {
    return typeArray.indexOf(type) !== -1;
  }

  postMessage(message: Message, iframeId: string) {
    console.log("POST-MSG", message);
    try {
      if (!!iframeId) {
        try {
          const getElement: any = document.getElementById(iframeId);
          this.findType(this.sendEventTypes, message.type) &&
            getElement &&
            getElement.contentWindow.postMessage(message, "*");
        } catch (error) {
          console.error(`Can't send this type as its not registered`, error);
        }
      } else {
        try {
          this.findType(this.sendEventTypes, message.type) &&
            window.parent.postMessage(message, "*");
        } catch (error) {
          console.error(`Error while posting message to parent!!! `, error);
        }
      }
    } catch (error) {
      console.error("error in postMessage", error);
    }
  }

  listenMessage(event: MessageEvent) {
    try {
      const data: Message = event.data;
      if (
        this.findType(
          this.receiveEventTypes.map((eventType: Handler) => eventType.type),
          data.type
        )
      ) {
        console.log("RECEIVE-MSG", event.data);
        const receiveEventType = this.receiveEventTypes.find(
          (eventType: Handler) => eventType.type === data.type
        );
        receiveEventType.callBack(data);
      }
    } catch (error) {
      console.error("error in listenMessage", error);
    }
  }
}
