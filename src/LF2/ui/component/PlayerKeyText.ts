import { IText } from "../../3d/IText";
import Invoker from "../../base/Invoker";
import GameKey from "../../defines/GameKey";
import Ditto from "../../ditto";
import type { UINode } from "../UINode";
import { UIComponent } from "./UIComponent";
import PlayerKeyEditor from "./PlayerKeyEditor";

export default class PlayerKeyText extends UIComponent {
  get player_id() {
    return this.args[0] || "";
  }
  get key_name() {
    return this.args[1] || "";
  }
  get player() {
    return this.lf2.players.get(this.player_id);
  }
  protected _sprite: IText;
  protected _unmount_jobs = new Invoker();

  constructor(layout: UINode, f_name: string) {
    super(layout, f_name);
    const [w, h] = this.node.size;
    this._sprite = new Ditto.TextNode(this.lf2)
      .set_position(Math.ceil(w / 2), Math.ceil(-h / 2), 1)
      .set_center(0.5, 0.5)
      .set_name(PlayerKeyEditor.name)
      .set_style({ font: "16px Arial" })
      .apply();
  }

  override on_resume() {
    super.on_resume();
    this.node.sprite.add(this._sprite);
    this._unmount_jobs.add(
      this.player?.callbacks.add({
        on_key_changed: () => this.update_sprite(),
      }),
      () => this._sprite.del_self(),
      () => this._on_cancel(),
    );
    this.update_sprite();
  }

  override on_pause(): void {
    super.on_pause();
    this._unmount_jobs.invoke_and_clear();
  }

  private _on_cancel = () => {
    this._sprite
      ?.set_style({ ...this._sprite.style, fill_style: "white" })
      .apply();
  };

  async update_sprite() {
    const { player } = this;
    if (!player) return;
    const keycode = player.keys[this.key_name as GameKey];
    this._sprite.set_text(keycode ?? "").apply();
  }
}
