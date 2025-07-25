import type IStyle from "../defines/IStyle";
import type { ISprite } from "./ISprite";

export interface IText extends ISprite {
  readonly is_text_node: true;
  get style(): IStyle;
  set style(v: IStyle);
  get text(): string;
  set text(v: string);

  get_style(): Readonly<IStyle>;
  set_style(v: IStyle): this;
  get_text(): string;
  set_text(v: string): this;
}
export const is_text_node = (v: any): v is IText =>
  v?.is_text_node === true;
