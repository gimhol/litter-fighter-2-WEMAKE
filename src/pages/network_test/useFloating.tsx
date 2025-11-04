import { useEffect, useRef } from "react";
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
export interface IUseFloatingOpts {
  responser?: HTMLElement | null;
  target?: HTMLElement | null;
  is_excluded?(e: HTMLElement): boolean;
  pivot_x?: number;
  pivot_y?: number;
}
export function useFloating(opts: IUseFloatingOpts) {
  const { responser, target = responser, is_excluded, pivot_x = 0, pivot_y = 0 } = opts;

  const ref_is_excluded = useRef(is_excluded)
  ref_is_excluded.current = is_excluded;
  useEffect(() => {
    if (!responser) return;
    if (!target) return;
    let offset_x = 0;
    let offset_y = 0;
    let prev_rect = target.getBoundingClientRect();
    const pointerdown = (e: PointerEvent) => {
      if (ref_is_excluded.current?.(e.target as HTMLElement)) return;
      const { x, y } = target.getBoundingClientRect();
      offset_x = x - e.clientX;
      offset_y = y - e.clientY;
      document.addEventListener('pointermove', pointermove);
      document.addEventListener('pointerup', pointerup);
      document.addEventListener('pointercancel', pointerup);
      prev_rect = target.getBoundingClientRect();
    };
    const pointermove = (e: PointerEvent) => {
      const { width, height } = target.getBoundingClientRect();
      const x = clamp(e.clientX + offset_x, 0, window.innerWidth - width)
      const y = clamp(e.clientY + offset_y, 0, window.innerHeight - height)
      target.style.left = (x) + 'px';
      target.style.top = (y) + 'px';
      target.style.bottom = target.style.right = 'unset'
      prev_rect = target.getBoundingClientRect();
    };
    const on_resize = () => {
      const rect = target.getBoundingClientRect()
      const world_anchor_x = Math.floor(pivot_x * prev_rect.width + prev_rect.x);
      const world_anchor_y = Math.floor(pivot_y * prev_rect.height + prev_rect.y);
      let x = world_anchor_x - pivot_x * rect.width
      let y = world_anchor_y - pivot_y * rect.height
      x = clamp(x, 0, window.innerWidth - rect.width)
      y = clamp(y, 0, window.innerHeight - rect.height)
      target.style.left = (x) + 'px';
      target.style.top = (y) + 'px';
      target.style.bottom = target.style.right = 'unset';
      prev_rect = rect;
    }
    const init = () => {
      const rect = target.getBoundingClientRect()
      let { x, y, width, height } = rect;
      x = clamp(x, 0, window.innerWidth - width)
      y = clamp(y, 0, window.innerHeight - height)
      target.style.left = (x) + 'px';
      target.style.top = (y) + 'px';
      target.style.bottom = target.style.right = 'unset';
      prev_rect = rect;
    }
    const pointerup = (e: PointerEvent) => {
      document.removeEventListener('pointermove', pointermove);
      document.removeEventListener('pointerup', pointerup);
      document.removeEventListener('pointercancel', pointerup);
    };
    responser.addEventListener('pointerdown', pointerdown);
    const resize_ob = new ResizeObserver(on_resize)
    resize_ob.observe(target)
    window.addEventListener('resize', on_resize)
    init();
    return () => {
      window.removeEventListener('resize', on_resize)
      responser.removeEventListener('pointerdown', pointerdown);
      document.removeEventListener('pointermove', pointermove);
      document.removeEventListener('pointerup', pointerup);
      document.removeEventListener('pointercancel', pointerup);
      resize_ob.disconnect()
    };
  }, [responser, target, pivot_x, pivot_y]);
}
