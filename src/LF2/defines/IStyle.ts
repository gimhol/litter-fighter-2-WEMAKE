type CanvasLineCap = string;
type CanvasLineJoin = string;
type CanvasGradient = string;
type CanvasPattern = string;
type CanvasDirection = string;
type CanvasFontKerning = string;
type CanvasFontStretch = string;
type CanvasFontVariantCaps = string;
type CanvasTextAlign = "left" | "right" | "center" | "end" | "start";
type CanvasTextBaseline = string;
type CanvasTextRendering = string;

export default interface IStyle {
  padding_t?: number;
  padding_b?: number;
  padding_l?: number;
  padding_r?: number;

  line_cap?: CanvasLineCap;
  line_dash_offset?: number;
  line_join?: CanvasLineJoin;
  line_width?: number;
  miter_limit?: number;

  shadow_blur?: number;
  shadow_color?: string;
  shadow_offset_x?: number;
  shadow_offset_y?: number;

  fill_style?: string | CanvasGradient | CanvasPattern;
  stroke_style?: string | CanvasGradient | CanvasPattern;

  direction?: CanvasDirection;
  font?: string;
  font_kerning?: CanvasFontKerning;
  font_stretch?: CanvasFontStretch;
  font_variant_caps?: CanvasFontVariantCaps;
  letter_spacing?: string;
  text_align?: CanvasTextAlign;
  text_baseline?: CanvasTextBaseline;
  text_rendering?: CanvasTextRendering;
  word_spacing?: string;

  smoothing?: boolean;
}
