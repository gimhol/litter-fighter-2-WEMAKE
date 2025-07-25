import { IText } from "../../3d/IText";
import IStyle from "../../defines/IStyle";
import Ditto from "../../ditto";
import { UIComponent } from "./UIComponent";
import PlayerScore from "./PlayerScore";
export default class PlayerScoreCell extends UIComponent {
  get kind() {
    return this.args[0];
  }
  get player_score() {
    return this.node.lookup_component(PlayerScore);
  }
  private _txt?: IText;

  override on_start(): void {
    super.on_start?.();
    this.node.sprite.add(
      (this._txt = new Ditto.TextNode(this.lf2).set_center(0.5, 0.5).apply()),
    );
  }

  override on_stop(): void {
    super.on_stop?.();
    this._txt?.del_self();
  }

  override on_show(): void {
    super.on_show?.();
    this._txt?.set_style(this.get_style()).set_text(this.get_txt()).apply();
  }

  protected get_style(): IStyle {
    const s = this.player_score;
    const c = this.player_score?.character;
    if (!s || !c) return this.node.style;
    if (this.kind === "status") {
      let clr = this.node.style.fill_style;
      if (c.hp > 0) clr = this.node.get_value("win_alive_color");
      else if (s.lose) clr = this.node.get_value("lose_color");
      else clr = this.node.get_value("win_dead_color");
      return { ...this.node.style, fill_style: clr };
    }
    return this.node.style;
  }
  protected get_txt() {
    const s = this.player_score;
    const c = this.player_score?.character;
    if (!s || !c) return "";
    switch (this.kind) {
      case "kill":
        return "" + c.kill_sum;
      case "attack":
        return "" + c.damage_sum;
      case "hp_lost":
        return "" + s.hp_lost;
      case "mp_usage":
        return "" + s.mp_usage;
      case "picking":
        return "" + c.picking_sum;
      case "status": {
        if (c.hp > 0) return this.node.get_value("win_alive_txt");
        else if (s.lose) return this.node.get_value("lose_txt");
        else return this.node.get_value("win_dead_txt");
      }
    }
    return "";
  }
}
