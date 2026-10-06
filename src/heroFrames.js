import heroVideo from "./videos/hero.mp4";

/*
  Turns the hero video into a list of still frames, once, in the background.
  Scrolling then just picks frames from this list, so it plays smoothly forwards
  and backwards on any video. No special encoding needed.
*/

const FPS = 12;
const listeners = new Set();

export const frames = {
  list: [],
  total: 0,
  loaded: 0,
  started: false,
  done: false,
  failed: false,
  skipped: false,
};

const emit = () => listeners.forEach((fn) => fn());
export const onFrames = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const reducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const saveData = () => typeof navigator !== "undefined" && navigator.connection?.saveData === true;

function finish(failed = false) {
  frames.done = true;
  frames.failed = failed && frames.loaded === 0;
  emit();
}

function store(k, blob) {
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  const ready = () => {
    frames.list[k] = img;
    frames.loaded++;
    if (frames.loaded >= frames.total) finish();
    else emit();
  };
  img.decode ? img.decode().then(ready, ready) : (img.onload = ready);
}

export function startFrames() {
  if (frames.started) return;
  frames.started = true;

  if (reducedMotion() || saveData()) {
    frames.skipped = true;
    finish();
    return;
  }

  const small = innerWidth < 768;
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = heroVideo;

  const fail = () => finish(true);
  video.addEventListener("error", fail, { once: true });

  video.addEventListener(
    "loadedmetadata",
    async () => {
      const D = video.duration;
      if (!D || !isFinite(D)) return fail();

      const total = Math.max(24, Math.min(Math.round(D * FPS), small ? 72 : 120));
      const step = D / (total - 1);
      const W = small ? 960 : 1280;
      const H = Math.round((W * (video.videoHeight || 9)) / (video.videoWidth || 16));
      frames.total = total;
      frames.list = new Array(total);

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      let next = 0;

      const grab = (upTo) => {
        if (upTo < next) return;
        ctx.drawImage(video, 0, 0, W, H);
        const from = next;
        next = upTo + 1;
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            for (let k = from; k <= upTo; k++) store(k, blob);
          },
          "image/jpeg",
          0.82
        );
      };

      if ("requestVideoFrameCallback" in video) {
        // Play quickly in the background and sample frames as they appear
        const onFrame = (_now, meta) => {
          grab(Math.min(total - 1, Math.floor(meta.mediaTime / step + 0.0001)));
          if (next < total && !video.ended) video.requestVideoFrameCallback(onFrame);
        };
        video.addEventListener("ended", () => grab(total - 1), { once: true });
        video.playbackRate = 3;
        video.requestVideoFrameCallback(onFrame);
        video.play().catch(fail);
      } else {
        // Older browsers: seek frame by frame
        for (let k = 0; k < total; k++) {
          await new Promise((res) => {
            video.addEventListener("seeked", res, { once: true });
            video.currentTime = Math.min(D - 0.01, k * step);
          });
          grab(k);
        }
      }
    },
    { once: true }
  );

  video.load();
}
