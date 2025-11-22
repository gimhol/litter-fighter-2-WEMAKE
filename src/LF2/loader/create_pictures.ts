import * as THREE from "three";
import IPicture from "../defines/IPicture";
import { TData } from "../entity/Entity";
import type { LF2 } from "../LF2";

export default function create_pictures(lf2: LF2, data: TData): Map<string, IPicture<THREE.Texture>> {
  const pictures = new Map<string, IPicture<THREE.Texture>>();
  const {
    base: { files },
  } = data;
  for (const key of Object.keys(files)) {
    const pic = lf2.images.create_pic_by_e_pic_info(files[key]);
    pic.id = key;
    pictures.set(key, pic);
  }
  return pictures;
}
