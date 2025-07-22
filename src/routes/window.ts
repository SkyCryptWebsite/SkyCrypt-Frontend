// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Window {
  dataLayer: IArguments[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag?: (...args: any[]) => void;
}
