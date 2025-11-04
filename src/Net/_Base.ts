import { MsgEnum } from "./MsgEnum";

/**
 * 请求信息
 * 客户端 ==> 服务端
 *
 * @export
 * @interface IReq
 * @template T
 */
export interface IReq<T extends MsgEnum = MsgEnum> {
  is_req: true;
  pid: string;
  type: T;
}

/**
 * 响应信息
 * 服务端 ==> 客户端
 * @export
 * @interface IResp
 * @template T
 */
export interface IResp<T extends MsgEnum = MsgEnum> {
  is_resp: true;
  pid: string;
  type: T;
  code?: number;
  error?: string;
}
