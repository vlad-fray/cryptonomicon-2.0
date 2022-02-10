export interface ITicker {
  name: string;
  price: number;
}

export interface IAppData {
  addedTickers: ITicker[];
  graph: number[];
  selectedTicker: ITicker | null;
  addingError: string | null;
}

export interface IMessage {
  action: string;
  subs: string[];
}

export interface IResponseMessage {
  TYPE: string;
  FROMSYMBOL: string;
  PRICE: number;
  MESSAGE: string;
  PARAMETER: string;
  TOSYMBOL: string;
}
export interface ITickersToTransfer {
  name: string;
  priceToBTC: number;
}

export interface ITickerNames {
  name: string;
  fullname: string;
}

export type ITickerHandlerFunc = (price: number) => void;
