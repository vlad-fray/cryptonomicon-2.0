import { IResponseMessage } from "./types";

export class Broadcast {
  static _channel = new BroadcastChannel("auth-data");

  static subscribe(onMessage: (data: IResponseMessage) => void): void {
    this._channel.addEventListener("message", (evt) => {
      onMessage(evt.data.data);
    });
  }

  static notify(data: IResponseMessage): void {
    this._channel.postMessage({
      data,
    });
  }
}
