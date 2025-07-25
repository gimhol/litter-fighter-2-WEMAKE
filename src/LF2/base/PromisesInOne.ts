import { PromiseInOne } from "promise-in-one/dist/es/pio";
import Ditto from "../ditto";

const pio = new PromiseInOne(
  ([type, args]: [string, any]) => type + Ditto.MD5(JSON.stringify(args))
);
export function PIO<T extends Object, K extends keyof T>(
  target: T,
  key: K,
  descriptor: TypedPropertyDescriptor<T[K]>,
) {
  const old = descriptor.value as any;
  if (typeof old !== "function") return descriptor;
  const name = target.constructor.name + "." + key.toString() + ".";
  descriptor.value = function (this: any, ...args: Parameters<typeof old>) {
    const that = this;
    return new Promise<any>((resolve, reject) => {
      const [pid, existed] = pio.check([name, args], resolve, reject);
      if (existed) return;
      const real_promise = old.apply(that, args);
      pio.handle(pid, real_promise);
    });
  } as any;
  return descriptor;
}
