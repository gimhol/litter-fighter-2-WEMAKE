import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { LF2 } from "../LF2/LF2";
import { floor } from "../LF2/utils";
import * as T from "./_t";
import styles from "./styles.module.scss";

export class Scene {
  readonly is_scene_node = true;
  protected _cameras = new Set<T.Camera>();
  protected _renderer?: T.WebGLRenderer;
  protected _css_renderer?: CSS2DRenderer;
  protected _canvas_ob = new MutationObserver(() => this.on_win_resize());
  readonly inner: T.Scene;
  readonly lf2: LF2;
  w: number = 0;
  h: number = 0;

  constructor(lf2: LF2) {
    this.inner = new T.Scene();
    this.lf2 = lf2;
    window.addEventListener('resize', this.on_win_resize)
  }
  on_win_resize = () => {
    if (!this._css_renderer || !this._renderer) return;
    const styles = window.getComputedStyle(this._renderer.domElement)

    let w = parseInt(styles.width)
    let h = parseInt(styles.height)
    const scale = w / this.lf2.world.width
    w = floor(w / scale)
    h = floor(h / scale)

    this._css_renderer.setSize(w, h)
    this._css_renderer.domElement.style.top = styles.top;
    this._css_renderer.domElement.style.left = styles.left;
    this._css_renderer.domElement.style.width = `${w}px`;
    this._css_renderer.domElement.style.height = `${h}px`;
    this._css_renderer.domElement.style.zIndex = '1';
    this._css_renderer.domElement.style.transform = `scale(${scale})`
    this._css_renderer.domElement.style.transformOrigin = `0px 0px`
  }
  set_canvas(canvas: HTMLCanvasElement | null | undefined) {
    if (this._renderer) {
      if (canvas === this._renderer.domElement)
        return;
      this._renderer.clear();
      this._renderer.dispose();
    }
    this._renderer = void 0;
    if (canvas) {
      const { w, h } = this
      this._canvas_ob.observe(canvas, { attributes: true, attributeFilter: ['style'] })
      this._renderer = new T.WebGLRenderer({ canvas, premultipliedAlpha: false });
      this._renderer.setSize(w, h, false);
      this._css_renderer = new CSS2DRenderer();
      this._css_renderer.domElement.className = styles.css_2d_renderer
      this.on_win_resize()
      document.body.appendChild(this._css_renderer.domElement);
    } else {
      this._canvas_ob.disconnect()
    }
  }
  add_camera(...cameras: T.Camera[]) {
    for (const camera of cameras) {
      if (this._cameras.has(camera)) continue;
      this._cameras.add(camera);
      this.inner.add(camera);
    }
  }

  set_size(w: number, h: number): this {
    this._renderer?.setSize(this.w = w, this.h = h, false);
    return this;
  }

  dispose(): void {
    window.removeEventListener('resize', this.on_win_resize)
    if (this._css_renderer)
      document.body.removeChild(this._css_renderer?.domElement);
    this._canvas_ob.disconnect()
    this._renderer?.clear();
    this._renderer?.dispose();
    this._renderer = void 0;
    this.inner.removeFromParent();
  }
  render(): void {
    const { inner } = this;
    if (!this._renderer || !inner) return;
    for (const camera of this._cameras) {
      this._renderer.render(inner, camera);
      this._css_renderer?.render(inner, camera);
    }
  }
}
