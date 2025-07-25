import IStyle from "../defines/IStyle";
export interface IComponentInfo {
  id?: string;
  args?: any[];
  name: string;
  enabled?: boolean;
}
export type TComponentInfo = IComponentInfo | string
export interface IAction {
  name: string;
  args?: any[];
}
export type TAction = IAction | string

export interface IUIInfo {
  /**
   * 节点ID
   *
   * @type {string}
   * @memberof IUIInfo
   */
  id?: string;

  /**
   * 节点名
   *
   * @type {string}
   * @memberof IUIInfo
   */
  name?: string;
  img?: string[] | string;
  opacity?: number;
  which?: number | string;
  rect?: number[] | string;
  center?: number[] | string;
  scale?: number[] | string;
  pos?: number[] | string;
  size?: number[] | string;
  visible?: boolean | string;
  disabled?: boolean | string;
  flip_x?: boolean;
  flip_y?: boolean;
  color?: string;
  component?: TComponentInfo | TComponentInfo[];
  style?: IStyle;
  txt?: string;
  actions?: {
    click: TAction | TAction[];
    resume?: TAction | TAction[];
    pause?: TAction | TAction[];
    start?: TAction | TAction[];
    stop?: TAction | TAction[];
  };
  key_press_actions?: [string, TAction][];
  items?: (IUIInfo | string)[];
  auto_focus?: boolean;
  /**
   * 模板名
   *
   * @type {string}
   * @memberof IUIInfo
   */
  template?: string;

  /**
   * 循环创建次数，默认为1
   *
   * @type {number}
   * @memberof IUIInfo
   */
  count?: number;

  values?: { [x in string]?: any };
  templates?: { [x in string]?: IUIInfo };
}
