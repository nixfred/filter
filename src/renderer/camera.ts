// Camera state for the 2.5D presentation (F002, FR005): pure zoom and pan
// arithmetic, shared by both adapter implementations and unit testable.
export interface CameraState {
  /** World units (light years) visible across the shorter viewport axis. */
  viewSpanLy: number;
  centerXLy: number;
  centerYLy: number;
}

export const CAMERA_DEFAULT: CameraState = {
  viewSpanLy: 110_000,
  centerXLy: 0,
  centerYLy: 0,
};

export const CAMERA_MIN_SPAN_LY = 2_000;
export const CAMERA_MAX_SPAN_LY = 160_000;

export function zoomCamera(camera: CameraState, factor: number): CameraState {
  const span = Math.min(
    CAMERA_MAX_SPAN_LY,
    Math.max(CAMERA_MIN_SPAN_LY, camera.viewSpanLy * factor),
  );
  return { ...camera, viewSpanLy: span };
}

export function panCamera(
  camera: CameraState,
  dxPixels: number,
  dyPixels: number,
  viewportShortSidePixels: number,
): CameraState {
  const lyPerPixel = camera.viewSpanLy / viewportShortSidePixels;
  return {
    ...camera,
    centerXLy: camera.centerXLy - dxPixels * lyPerPixel,
    centerYLy: camera.centerYLy + dyPixels * lyPerPixel,
  };
}
