import { Mouse } from "../typescript/mouse.js";
import * as log from "../typescript/log.js";
import * as html from "../typescript/html.js";

class Main {
  div: html.HtmlElement;
  canvas: html.HtmlElement;
  log: log.Log;
  log_src: log.Logger;
  mouse: Mouse;
  constructor() {
    this.log = new log.Log();
    this.log_src = new log.Logger(this.log, "main");
    this.div = new html.HtmlElement(
      document.getElementById("DrawCanvas")! as HTMLDivElement,
    );
    this.canvas = this.div.add_ele("canvas");
    const canvas = this.canvas.ele as HTMLCanvasElement;
    canvas.width = 600;
    canvas.height = 400;
    const ctxt = canvas.getContext("2d")!;
    ctxt.fillStyle = "#FFA";
    ctxt.fillRect(0, 0, canvas.width, canvas.height);
    this.mouse = new Mouse(this, canvas);
  }
  user_zoom(xy: [number, number], factor: number): void {
    this.log_src.info(`Zoom ${xy} ${factor}`);
  }
  user_rotate(xy: [number, number], angle: number): void {
    this.log_src.info(`Rotate ${xy} ${angle}`);
  }
  user_pan(xy: [number, number], dxy: [number, number]): void {
    this.log_src.info(`Pan ${xy} ${dxy}`);
  }
  user_press(xy: [number, number]): number {
    this.log_src.info(`Press ${xy}`);
    return 0;
  }
  user_press_move(start_xy: [number, number], xy: [number, number]): void {
    this.log_src.info(`Press move ${start_xy} ${xy}`);
  }
  user_press_cancel(start_xy: [number, number]): void {
    this.log_src.info(`Press cancel ${start_xy}`);
  }
  user_release(start_xy: [number, number], xy: [number, number]): void {
    this.log_src.info(`Press release ${start_xy} ${xy}`);
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
