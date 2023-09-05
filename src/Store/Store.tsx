import createFastContext from "./FastContext";
import { fetchResult } from "../Components/DebounceText";

export type data = {
  api: number,
  selectedCell: number,
  selectedImage: number,
  disableTextField: boolean,
  darkTheme: boolean,
  imageList: {
    base64: string,
    title: string
  }[],
  fetchResult: fetchResult,
}

let data: data;
data = {
  api: 0,
  selectedCell: NaN,
  selectedImage: NaN,
  disableTextField: true,
  darkTheme: true,
  imageList: new Array(9).fill(undefined).map(() => ({ base64: '', title: '' })),
  fetchResult: {},
}

const { Provider, useStore } = createFastContext(data);

export { useStore };
export default Provider;