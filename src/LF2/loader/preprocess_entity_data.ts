import { Defines, IEntityData } from "../defines";
import LF2 from "../LF2";
import { not_blank_str } from "../utils";
import { traversal } from "../utils/container_help/traversal";
import { check_frame } from "./check_frame";
import { preprocess_frame } from "./preprocess_frame";
import { preprocess_next_frame } from "./preprocess_next_frame";

export async function preprocess_entity_data(lf2: LF2, data: IEntityData, jobs: Promise<any>[]): Promise<IEntityData> {
  const { images, sounds } = lf2;

  const { small, head } = data.base;
  data.base.fall_value = data.base.fall_value ?? Defines.DEFAULT_FALL_VALUE_MAX;
  data.base.defend_value = data.base.defend_value ?? Defines.DEFAULT_DEFEND_VALUE_MAX;
  data.base.hp = data.base.hp ?? Defines.DEFAULT_HP;
  data.base.mp = data.base.mp ?? Defines.DEFAULT_MP;

  not_blank_str(small) && jobs.push(images.load_img(small, small));
  not_blank_str(head) && jobs.push(images.load_img(head, head));
  data.base.dead_sounds?.forEach(i => not_blank_str(i) && sounds.load(i, i));
  data.base.drop_sounds?.forEach(i => not_blank_str(i) && sounds.load(i, i));
  data.base.hit_sounds?.forEach(i => not_blank_str(i) && sounds.load(i, i));

  if (data.on_dead) data.on_dead = preprocess_next_frame(data.on_dead);
  if (data.on_exhaustion) data.on_exhaustion = preprocess_next_frame(data.on_exhaustion);
  const { frames, base: { files } } = data;

  traversal(files, (_, v) => jobs.push(images.load_by_e_pic_info(v)));
  if (jobs.length) await Promise.all(jobs);

  traversal(frames, (k, v, o) => o[k] = preprocess_frame(lf2, data, v, jobs));
  traversal(frames, (k, v, o) => o[k] = preprocess_frame(lf2, data, v, jobs));
  traversal(frames, (_, v) => check_frame(data, v));
  return data;
}


