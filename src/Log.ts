import L from "@fimagine/logger";
L.Config.currentTime = () =>
  new Date().toISOString().replace(/T/g, " ").replace("Z", "");
export const Log = Object.assign(
  L.Log.Clone({ showArgs: true, showRet: true, disabled: false }),
  {
    print(...args: any[]) {
      return console.log(...args);
    },
  },
);

export const Warn = Object.assign(
  L.Warn.Clone({ showArgs: true, showRet: true, disabled: false }),
  {
    print(...args: any[]) {
      return console.debug(...args);
    },
  },
);
export const Debug = Object.assign(
  L.Debug.Clone({ showArgs: true, showRet: true, disabled: false }),
  {
    print(...args: any[]) {
      return console.debug(...args);
    },
  },
);
