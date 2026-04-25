import * as mouse from "./mouse.js";
import * as log from "./log.js";
import * as html from "./html.js";

class Main {
  div: html.HtmlElement;
  canvas: HTMLCanvasElement;
  log: log.Log;
  log_src: log.Logger;
  mouse: mouse.Mouse;
  blob_xy: [number, number] = [100, 100];
  blob_rot: number = 0;
  blob_size: number = 40;
  blob_pressed: boolean = false;
  constructor() {
    this.log = new log.Log("", log.Severity.Fatal, log.Severity.Verbose);
    this.log_src = new log.Logger(this.log, "main");
    this.div = new html.HtmlElement(
      document.getElementById("DrawCanvas")! as HTMLDivElement,
    );
    this.canvas = this.div.add_ele("canvas").ele as HTMLCanvasElement;
    this.canvas.width = 320;
    this.canvas.height = 400;
    this.mouse = new mouse.Mouse(this, this.canvas);
    this.redraw();
  }
  redraw(): void {
    const ctxt = this.canvas.getContext("2d")!;
    ctxt.fillStyle = "#FFA";
    ctxt.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctxt.save();
    ctxt.fillStyle = "#E44";
    if (this.blob_pressed) {
      ctxt.fillStyle = "#4EE";
    }

    ctxt.translate(
      this.canvas.width / 2 + this.blob_xy[0],
      this.canvas.height / 2 + this.blob_xy[1],
    );
    ctxt.rotate(this.blob_rot);
    ctxt.fillRect(
      -this.blob_size / 2,
      -this.blob_size / 2,
      this.blob_size,
      this.blob_size,
    );
    ctxt.restore();
  }
  xy_is_on_blob(xy: [number, number]): boolean {
    let dx = xy[0] - (this.canvas.width / 2 + this.blob_xy[0]);
    let dy = xy[1] - (this.canvas.height / 2 + this.blob_xy[1]);
    let dx_r = dx * Math.cos(this.blob_rot) - dy * Math.sin(this.blob_rot);
    let dy_r = dy * Math.cos(this.blob_rot) + dx * Math.sin(this.blob_rot);
    return (
      Math.abs(dx_r) < this.blob_size / 2 && Math.abs(dy_r) < this.blob_size / 2
    );
  }

  user_zoom(xy: [number, number], factor: number): void {
    this.log_src.info(`Zoom ${xy} ${factor}`);
    this.blob_size *= factor;
    this.redraw();
  }
  user_rotate(xy: [number, number], angle: number): void {
    this.log_src.info(`Rotate ${xy} ${angle}`);
    this.blob_rot += angle;
    this.redraw();
  }
  user_pan(xy: [number, number], dxy: [number, number]): void {
    this.log_src.info(`Pan ${xy} ${dxy}`);
    this.blob_xy[0] += dxy[0];
    this.blob_xy[1] += dxy[1];
    this.redraw();
  }
  user_press(xy: [number, number], actions: mouse.MousePressActions): void {
    this.log_src.info(`Press ${xy}`);
    if (this.xy_is_on_blob(xy)) {
      this.blob_pressed = true;
      actions.can_drag = false;
    }
    this.redraw();
  }
  user_press_move(start_xy: [number, number], xy: [number, number]): void {
    this.log_src.info(`Press move ${start_xy} ${xy}`);
    this.blob_pressed = this.xy_is_on_blob(xy);
    this.redraw();
  }
  user_press_cancel(start_xy: [number, number]): void {
    this.log_src.info(`Press cancel ${start_xy}`);
    this.blob_pressed = false;
    this.redraw();
  }
  user_release(start_xy: [number, number], xy: [number, number]): void {
    this.log_src.info(`Press release ${start_xy} ${xy}`);
    if (this.blob_pressed) {
      window.alert("Blob clicked!");
    }
    this.blob_pressed = false;

    this.redraw();
  }

  drag_start(start_xy: [number, number], xy: [number, number]): void {
    this.log_src.info(`Drag start ${start_xy} ${xy}`);
  }

  drag_to(
    start_xy: [number, number],
    old_xy: [number, number],
    new_xy: [number, number],
  ): void {
    this.log_src.info(`Drag ${start_xy} ${old_xy} ${new_xy}`);
    this.blob_xy[0] += new_xy[0] - old_xy[0];
    this.blob_xy[1] += new_xy[1] - old_xy[1];
    this.redraw();
  }
  // Drag (which started at start_xy) has finished at xy (which the last drag_to probably indicated)
  drag_end(start_xy: [number, number], xy: [number, number]): void {
    this.log_src.info(`Drag end ${start_xy} ${xy}`);
  }
}

(window as any).main = null;

function complete_init() {
  (window as any).main = new Main();
}

window.addEventListener("load", (_e) => {
  complete_init();
});
