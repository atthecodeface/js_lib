import { Tabs } from "./tabs.js";
import { WasmQuatf32, WasmTransformf32, WasmVec3f32 } from "./wasm_pkg.js";
import * as html from "./html.js";
import * as log from "./log.js";
import * as mouse from "./mouse.js";

import * as web_gl from "./web_gl.js";
import * as web_gl_flat from "./web_gl_flat.js";
import * as web_gl_3d_obj from "./web_gl_3d_obj.js";
import * as web_gl_pt_field from "./web_gl_pt_field.js";

class TabType {
  redraw_fn: ((webgl: web_gl.Webgl) => void) | null = null;
  constructor() {}
  set_client(redraw_fn: (webgl: web_gl.Webgl) => void): TabType {
    this.redraw_fn = redraw_fn;
    return this;
  }
  uses_floating_canvas(): boolean {
    return this.redraw_fn !== null;
  }
}

export class Main implements mouse.MouseClient {
  tabs: Tabs<TabType>;
  selected_tab: TabType | null = null;
  webgl: web_gl.Webgl;
  mouse: mouse.Mouse;

  resize_observer: ResizeObserver;

  simple_program: number;
  pt_field_program: number;
  flat_program: number;

  pt_field: web_gl_pt_field.WebglPtFieldObj;
  axis: web_gl_flat.WebglFlatObj;
  cube: web_gl_3d_obj.Webgl3DObj;

  camera: WasmTransformf32;
  fov: number = 1.0;

  texture: web_gl.WebglTexture | null = null;
  image_filename: string = "Cubemap.jpg";

  constructor() {
    this.tabs = new Tabs("tab-list", this.tab_selected.bind(this), [
      [
        "tab-axes",
        "Axes",
        new TabType().set_client(this.redraw_axes.bind(this)),
      ],
      [
        "tab-pt-field",
        "Point field",
        new TabType().set_client(this.redraw_pt_field.bind(this)),
      ],
      [
        "tab-cube",
        "Cube",
        new TabType().set_client(this.redraw_cube.bind(this)),
      ],
      ["tab-all", "All", new TabType().set_client(this.redraw_all.bind(this))],
    ]);

    this.camera = new WasmTransformf32();
    this.camera.translate_by([0, 0, 2]);
    this.resize_observer = new ResizeObserver(this.resize_event.bind(this));

    const div = document.getElementById("WebglCanvas")!;
    const canvas = document.createElement("canvas")!;
    div.appendChild(canvas);

    this.mouse = new mouse.Mouse(this, canvas);

    // this.mouse = new Mouse(this, canvas);
    const logger = new log.Log();
    this.webgl = new web_gl.Webgl(logger, canvas);
    this.webgl.start_webgl();
    {
      this.simple_program = this.webgl.compile_program(
        new web_gl_3d_obj.Webgl3DObjSimpleShader(),
      )!;
      this.pt_field_program = this.webgl!.compile_program(
        new web_gl_pt_field.WebglPtFieldShader(),
      )!;
      this.flat_program = this.webgl!.compile_program(
        new web_gl_flat.WebglFlatShader(),
      )!;
      this.axis = web_gl_flat.WebglFlatObj.axis(2, [
        [10, 0.02],
        [50, 0.01],
        [2, 0.05],
      ]);

      this.cube = web_gl_3d_obj.Webgl3DObj.cuboid(6, 6, 6);

      /** pt_field sphere random surface uses nx=10000, ny=10000, nz=1, pt_weight 1, size_range whatever, is_sphere true */
      /** pt_field square random surface uses nx=10000, ny=10000, nz=1, pt_weight 1, size_range whatever, is_sphere false */
      /** pt_field cube random volume uses nx=1000, ny=1000, nz=1000, pt_weight 1, size_range whatever, is_sphere false */
      /** pt_field cube grid volume uses nx=20, ny=20, nz=20, pt_weight 1, size_range whatever, is_sphere false */
      // this.pt_field = new web_gl_pt_field.WebglPtFieldObj(8000, 20, 20, 20)
      this.pt_field = new web_gl_pt_field.WebglPtFieldObj(
        8000,
        2000,
        2000,
        2000,
      )
        .set_pt_random_weight(1.0)
        //.set_field_kind(web_gl_pt_field.WebglPtFieldKind.Sphere)
        .set_field_kind(web_gl_pt_field.WebglPtFieldKind.CubeSurface)
        .set_size_range(1, 3);

      //this.pt_field.is_sphere = true;

      this.webgl.create(this.pt_field);
      this.webgl.create(this.axis);
      this.webgl.create(this.cube);

      this.texture = new web_gl.WebglTexture(this.webgl, new Image());
      this.texture.image!.src = this.image_filename;
    }

    for (const resizable_content of document.getElementsByClassName(
      "get_size_of_this",
    )) {
      this.resize_observer.observe(resizable_content);
    }

    this.tabs.select("tab-cube");
  }

  resize_event(_e: ResizeObserverEntry[]): void {
    const resizable_box = document.getElementsByClassName(
      "get_size_of_this",
    )![0]! as HTMLDivElement;
    const width = resizable_box.offsetWidth;
    const height = resizable_box.offsetHeight;

    this.webgl.canvas.width = width;
    this.webgl.canvas.height = height;
  }

  tab_selected(tab: TabType, _tab_id: string) {
    this.selected_tab = tab;
    const e = new html.HtmlElement(document.getElementById("floating-div")!);
    if (this.selected_tab.uses_floating_canvas()) {
      e.set_style("display", "");
      this.redraw();
    } else {
      e.set_style("display", "none");
    }
  }

  redraw_common(webgl: web_gl.Webgl): Float32Array {
    const view_matrix = new Float32Array(16);
    this.camera.set_mat4(view_matrix);
    webgl.set_projection_perspective(
      this.fov,
      webgl.canvas.width / webgl.canvas.height,
      1,
      15.0,
    );
    return view_matrix;
  }

  redraw_axes(webgl: web_gl.Webgl): void {
    const view_matrix = this.redraw_common(webgl);

    webgl.use_program(this.flat_program);
    webgl.set_uniform_projection();
    webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix, false);
    webgl.set_uniform_mat4(
      web_gl.WebglUniform.Model,
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1, 0, 0, 1],
    );
    webgl.set_color([1, 0, 0.5, 1]);
    webgl.draw(this.axis);

    webgl.set_uniform_mat4(
      web_gl.WebglUniform.Model,
      [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1, 0, 1],
    );
    webgl.set_color([0, 0.5, 1, 1]);
    webgl.draw(this.axis);

    webgl.set_uniform_mat4(
      web_gl.WebglUniform.Model,
      [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 1],
    );
    webgl.set_color([0.5, 1, 0, 1]);
    webgl.draw(this.axis);
  }

  redraw_pt_field(webgl: web_gl.Webgl): void {
    const view_matrix = this.redraw_common(webgl);

    webgl.use_program(this.pt_field_program);
    webgl.set_uniform_projection();
    webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix, false);
    webgl.set_uniform_mat4(web_gl.WebglUniform.Model, webgl.identity);
    webgl.draw(this.pt_field!);
  }

  redraw_cube(webgl: web_gl.Webgl): void {
    const view_matrix = this.redraw_common(webgl);

    webgl.use_program(this.simple_program);
    webgl.set_color([0.5, 1, 0.2, 1]);
    if (this.texture !== null) {
      webgl.set_texture(this.texture);
    }

    webgl.set_uniform_projection();
    webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix, false);

    webgl.set_uniform_mat4(web_gl.WebglUniform.Model, webgl.identity);
    webgl.draw(this.cube);

    webgl.set_uniform_mat4(
      web_gl.WebglUniform.Model,
      [0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 1],
    );
    webgl.draw(this.cube);
  }

  redraw_all(webgl: web_gl.Webgl): void {
    this.redraw_axes(webgl);
    this.redraw_cube(webgl);
    this.redraw_pt_field(webgl);
  }

  redraw(): void {
    if (this.selected_tab === null) {
      return;
    }
    const tab_redraw_fn = this.selected_tab.redraw_fn;
    if (tab_redraw_fn !== null) {
      this.webgl.set_viewport();
      this.webgl.clear_buffer();

      tab_redraw_fn(this.webgl);
    }
  }

  user_zoom(_xy: [number, number], factor: number): void {
    this.fov /= factor;
    this.fov = Math.min(Math.max(this.fov, 0.2), 4.0);
    this.redraw();
  }
  user_rotate(_xy: [number, number], _angle: number): void {}
  user_pan(_xy: [number, number], _dxy: [number, number]): void {}
  user_press(_xy: [number, number], _actions: mouse.MousePressActions): void {}
  user_press_move(_start_xy: [number, number], _xy: [number, number]): void {}
  user_press_cancel(_start_xy: [number, number]): void {}
  user_release(_start_xy: [number, number], _xy: [number, number]): void {}
  drag_start(_start_xy: [number, number], _xy: [number, number]): void {}
  drag_to(
    _start_xy: [number, number],
    old_xy: [number, number],
    new_xy: [number, number],
  ): void {
    const dx = new_xy[0] - old_xy[0];
    const dy = new_xy[1] - old_xy[1];
    const qx = WasmQuatf32.of_axis_angle(new WasmVec3f32(0, 1, 0), -dx * 0.01);
    const qy = WasmQuatf32.of_axis_angle(new WasmVec3f32(1, 0, 0), -dy * 0.01);
    this.camera.rotate_by(qx);
    this.camera.rotate_by(qy);
    this.redraw();
  }
  // Drag (which started at start_xy) has finished at xy (which the last drag_to probably indicated)
  drag_end(_start_xy: [number, number], _xy: [number, number]): void {}
}

window.addEventListener("load", (_e) => {
  (window as any).main = new Main();
});
