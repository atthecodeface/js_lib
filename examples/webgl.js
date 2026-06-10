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
    constructor() {
        this.redraw_fn = null;
    }
    set_client(redraw_fn) {
        this.redraw_fn = redraw_fn;
        return this;
    }
    uses_floating_canvas() {
        return this.redraw_fn !== null;
    }
}
export class Main {
    constructor() {
        this.selected_tab = null;
        this.fov = 1.0;
        this.texture = null;
        this.image_filename = "Cubemap.jpg";
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
        this.camera.translate_by(new WasmVec3f32(0, 0, 4));
        this.resize_observer = new ResizeObserver(this.resize_event.bind(this));
        const div = document.getElementById("WebglCanvas");
        const canvas = document.createElement("canvas");
        div.appendChild(canvas);
        this.mouse = new mouse.Mouse(this, canvas);
        // this.mouse = new Mouse(this, canvas);
        const logger = new log.Log();
        this.webgl = new web_gl.Webgl(logger, canvas);
        this.webgl.start_webgl();
        {
            this.simple_program = this.webgl.compile_program(new web_gl_3d_obj.Webgl3DObjSimpleShader());
            this.pt_field_program = this.webgl.compile_program(new web_gl_pt_field.WebglPtFieldShader());
            this.flat_program = this.webgl.compile_program(new web_gl_flat.WebglFlatShader());
            this.axis = web_gl_flat.WebglFlatObj.axis(2, [
                [10, 0.02],
                [50, 0.01],
                [2, 0.05],
            ]);
            this.cube = web_gl_3d_obj.Webgl3DObj.cuboid(1, 1, 1);
            /** pt_field sphere random surface uses nx=10000, ny=10000, nz=1, pt_weight 1, size_range whatever, is_sphere true */
            /** pt_field square random surface uses nx=10000, ny=10000, nz=1, pt_weight 1, size_range whatever, is_sphere false */
            /** pt_field cube random volume uses nx=1000, ny=1000, nz=1000, pt_weight 1, size_range whatever, is_sphere false */
            /** pt_field cube grid volume uses nx=20, ny=20, nz=20, pt_weight 1, size_range whatever, is_sphere false */
            // this.pt_field = new web_gl_pt_field.WebglPtFieldObj(8000, 20, 20, 20)
            this.pt_field = new web_gl_pt_field.WebglPtFieldObj(8000, 2000, 2000, 2000)
                .set_pt_random_weight(1.0)
                //.set_field_kind(web_gl_pt_field.WebglPtFieldKind.Sphere)
                .set_field_kind(web_gl_pt_field.WebglPtFieldKind.CubeSurface)
                .set_size_range(1, 3);
            //this.pt_field.is_sphere = true;
            this.webgl.create(this.pt_field);
            this.webgl.create(this.axis);
            this.webgl.create(this.cube);
            this.texture = new web_gl.WebglTexture(this.webgl, new Image());
            this.texture.image.src = this.image_filename;
        }
        const pt_field_ctls = new html.HtmlElement(document.getElementById("pt_field_ctls"));
        pt_field_ctls.add_input_range("pt_field_num_pts", { min: 1, max: 10000 }, this.pt_field_set_num_pts.bind(this), {});
        pt_field_ctls.add_input_range("pt_field_nx", { min: 1, max: 100 }, this.pt_field_set_nx.bind(this), {});
        pt_field_ctls.add_input_range("pt_field_ny", { min: 1, max: 100 }, this.pt_field_set_ny.bind(this), {});
        pt_field_ctls.add_input_range("pt_field_nz", { min: 1, max: 100 }, this.pt_field_set_nz.bind(this), {});
        pt_field_ctls.add_input_range("pt_field_style", { min: 0, max: 15 }, this.pt_field_set_style.bind(this), {});
        pt_field_ctls.add_input_range("pt_random_weight", { min: 0, max: 1.0, step: 0.01 }, this.pt_field_set_random_weight.bind(this), {});
        for (const resizable_content of document.getElementsByClassName("get_size_of_this")) {
            this.resize_observer.observe(resizable_content);
        }
        this.tabs.select("tab-cube");
    }
    pt_field_set_num_pts(_event, value) {
        this.pt_field.set_num_points(value);
        this.redraw();
    }
    pt_field_set_nx(_event, value) {
        this.pt_field.set_dims(value, this.pt_field.ny, this.pt_field.nz);
        this.redraw();
    }
    pt_field_set_ny(_event, value) {
        this.pt_field.set_dims(this.pt_field.nx, value, this.pt_field.nz);
        this.redraw();
    }
    pt_field_set_nz(_event, value) {
        this.pt_field.set_dims(this.pt_field.nx, this.pt_field.ny, value);
        this.redraw();
    }
    pt_field_set_style(_event, value) {
        this.pt_field.set_field_kind(value);
        this.redraw();
    }
    pt_field_set_random_weight(_event, value) {
        this.pt_field.set_pt_random_weight(value);
        this.redraw();
    }
    resize_event(_e) {
        const resizable_box = document.getElementsByClassName("get_size_of_this")[0];
        const width = resizable_box.offsetWidth;
        const height = resizable_box.offsetHeight;
        this.webgl.canvas.width = width;
        this.webgl.canvas.height = height;
    }
    tab_selected(tab, _tab_id) {
        this.selected_tab = tab;
        const e = new html.HtmlElement(document.getElementById("floating-div"));
        if (this.selected_tab.uses_floating_canvas()) {
            e.set_style("display", "");
            this.redraw();
        }
        else {
            e.set_style("display", "none");
        }
    }
    redraw_common(webgl) {
        const view_matrix = new Float32Array(16);
        this.camera.set_mat4(view_matrix);
        webgl.set_projection_perspective(this.fov, webgl.canvas.width / webgl.canvas.height, 0.05, 15.0);
        return view_matrix;
    }
    redraw_axes(webgl) {
        const view_matrix = this.redraw_common(webgl);
        webgl.use_program(this.flat_program);
        webgl.set_uniform_projection();
        webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix, true);
        webgl.set_uniform_mat4(web_gl.WebglUniform.Model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1, 0, 0, 1]);
        webgl.set_color([1, 0, 0.5, 1]);
        webgl.draw(this.axis);
        webgl.set_uniform_mat4(web_gl.WebglUniform.Model, [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1, 0, 1]);
        webgl.set_color([0, 0.5, 1, 1]);
        webgl.draw(this.axis);
        webgl.set_uniform_mat4(web_gl.WebglUniform.Model, [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 1]);
        webgl.set_color([0.5, 1, 0, 1]);
        webgl.draw(this.axis);
    }
    redraw_pt_field(webgl) {
        const view_matrix = this.redraw_common(webgl);
        webgl.use_program(this.pt_field_program);
        webgl.set_uniform_projection();
        webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix, true);
        webgl.set_uniform_mat4(web_gl.WebglUniform.Model, webgl.identity);
        webgl.draw(this.pt_field);
    }
    redraw_cube(webgl) {
        webgl.use_program(this.simple_program);
        webgl.set_color([0.5, 1, 0.2, 1]);
        if (this.texture !== null) {
            webgl.set_texture(this.texture);
        }
        const view_matrix = this.redraw_common(webgl);
        const view_matrix_at_origin = new Float32Array(16);
        view_matrix_at_origin.set(view_matrix);
        view_matrix_at_origin[3] = 0;
        view_matrix_at_origin[7] = 0;
        view_matrix_at_origin[11] = 0;
        view_matrix_at_origin[12] = 0;
        view_matrix_at_origin[13] = 0;
        view_matrix_at_origin[14] = 0;
        webgl.set_uniform_projection();
        webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix_at_origin, true);
        webgl.set_uniform_mat4(web_gl.WebglUniform.Model, [8, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1]);
        webgl.draw(this.cube);
        webgl.clear_depth_buffer();
        webgl.set_uniform_mat4(web_gl.WebglUniform.View, view_matrix, true);
        webgl.set_uniform_mat4(web_gl.WebglUniform.Model, [0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1]);
        webgl.draw(this.cube);
    }
    redraw_all(webgl) {
        // Cube first as it has the background skymap
        this.redraw_cube(webgl);
        this.redraw_axes(webgl);
        this.redraw_pt_field(webgl);
    }
    redraw() {
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
    user_zoom(_xy, factor) {
        this.fov /= factor;
        this.fov = Math.min(Math.max(this.fov, 0.2), 4.0);
        this.redraw();
    }
    user_rotate(_xy, _angle) { }
    user_pan(_xy, _dxy) { }
    user_press(_xy, _actions) { }
    user_press_move(_start_xy, _xy) { }
    user_press_cancel(_start_xy) { }
    user_release(_start_xy, _xy) { }
    drag_start(_start_xy, _xy) { }
    drag_to(_start_xy, old_xy, new_xy) {
        const dx = new_xy[0] - old_xy[0];
        const dy = new_xy[1] - old_xy[1];
        const qx = WasmQuatf32.of_axis_angle(new WasmVec3f32(0, 1, 0), -dx * 0.01);
        const qy = WasmQuatf32.of_axis_angle(new WasmVec3f32(1, 0, 0), -dy * 0.01);
        this.camera.rotate_by(qx);
        this.camera.rotate_by(qy);
        this.redraw();
    }
    // Drag (which started at start_xy) has finished at xy (which the last drag_to probably indicated)
    drag_end(_start_xy, _xy) { }
}
window.addEventListener("load", (_e) => {
    window.main = new Main();
});
