"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webgl3DObj = exports.Webgl3DObjSimpleShader = void 0;
class Webgl3DObjSimpleShader {
    constructor() {
        this.id = "webgl_3d_simple";
        this.extra_uniforms = [];
        this.vertex = `#version 300 es
  uniform mat4 projection;
  uniform mat4 view;
  uniform mat4 model;

  in vec4 position;
  in vec2 tex_coord;

  out vec2 vTextureCoord;
  void main() {
    vec4 pos;
    pos = projection * view * model * position;
    gl_Position = pos;
    vTextureCoord = tex_coord;
  }
`;
        this.fragment = `#version 300 es
  precision mediump float;
  uniform vec4 color;
  uniform sampler2D uSampler;

  in vec2 vTextureCoord;

  out vec4 FragColor; // must be the only output declaration; is not implicit!

  void main() {
    FragColor = texture(uSampler, vTextureCoord);
 }
  `;
    }
}
exports.Webgl3DObjSimpleShader = Webgl3DObjSimpleShader;
class Webgl3DObj {
    constructor(max_vertices, max_indices) {
        this.num_vertices = 0;
        this.num_indices = 0;
        this.position_buf = null;
        this.tex_coord_buf = null;
        this.indices_buf = null;
        this.positions = new Float32Array(3 * max_vertices);
        this.tex_coords = new Float32Array(2 * max_vertices);
        this.indices = new Uint16Array(3 * max_indices);
    }
    static cuboid(dx, dy, dz) {
        //
        // The cubemap texture is defined by
        //
        //    0 => (0, 1, Quat::look_at(&[-1., 0., 0.], &[0., 1., 0.])),
        //    1 => (1, 1, Quat::look_at(&[0., 0., -1.], &[0., 1., 0.])),
        //    2 => (2, 1, Quat::look_at(&[1., 0., 0.], &[0., 1., 0.])),
        //    3 => (3, 1, Quat::look_at(&[0., 0., 1.], &[0., 1., 0.])),
        //    4 => (1, 0, Quat::look_at(&[0., 1., 0.], &[0., 0., 1.])),
        //    5 => (1, 2, Quat::look_at(&[0., -1., 0.], &[0., 0., -1.])),
        //
        // a---bH--cG--d---e      H-----G    Z            0 : A E H D
        // |   | 4 |   |   |     /     /|    |   Y        1 : A B F E
        // fH--gE--hF--iG--jH   D-----C |    | /          2 : B C G F
        // | 0 | 1 | 2 | 3 |    |     | F    |/           3 : C G H D
        // kD--lA--mB--nC--oD   |     |/     +-----X      4 : E F G H
        // |   | 5 |   |   |    A-----B                   5 : A D C B
        // p---qD--rC--s---t
        //
        // Triangles ABC, ACD, BFG, BGC, FEH, FHG, EAD, EDH, DCG, DGH, ABF, AFE
        // as        lmr, lrq, mhi, min, hgb, hbc, glk, gkf, oni, oij, lmh, lhg
        //
        // Points/texcoords are stored lmnokhgijfbcqr
        const t0_4 = 0.0;
        const t1_4 = 0.25;
        const t2_4 = 0.5;
        const t3_4 = 0.75;
        const t4_4 = 1.0;
        const t0_3 = 0.0;
        const t1_3 = 0.33333333;
        const t2_3 = 0.66666666;
        const t3_3 = 1.0;
        const cube = new Webgl3DObj(0, 0);
        cube.positions = new Float32Array([
            -dx,
            -dy,
            -dz,
            dx,
            -dy,
            -dz,
            dx,
            -dy,
            dz,
            -dx,
            -dy,
            dz,
            -dx,
            -dy,
            dz, // near face + D repeated (l,m,n,o,k)
            -dx,
            dy,
            -dz,
            dx,
            dy,
            -dz,
            dx,
            dy,
            dz,
            -dx,
            dy,
            dz,
            -dx,
            dy,
            dz, // far face + H repeated (g,h,i,j,f)
            -dx,
            dy,
            dz,
            dx,
            dy,
            dz, // b, c
            -dx,
            -dy,
            dz,
            dx,
            -dy,
            dz, // q, r
        ]);
        cube.tex_coords = new Float32Array([
            t1_4,
            t2_3,
            t2_4,
            t2_3,
            t3_4,
            t2_3,
            t4_4,
            t2_3,
            t0_4,
            t2_3, // l, m, n, o, k
            t1_4,
            t1_3,
            t2_4,
            t1_3,
            t3_4,
            t1_3,
            t4_4,
            t1_3,
            t0_4,
            t1_3, // g,h,i,j,f
            t1_4,
            t0_3,
            t2_4,
            t0_3, // b, c
            t1_4,
            t3_3,
            t2_4,
            t3_3, // q, r
        ]);
        // as        lmr, lrq, mhi, min, hgb, hbc, glk, gkf, oni, oij, lmh, lhg
        //
        // Points/texcoords are stored lmnok hgijf bcqr
        cube.indices = new Uint16Array([
            0, 1, 13, 0, 13, 12,
            1, 6, 7, 1, 7, 2,
            3, 2, 7, 3, 7, 8,
            0, 1, 6, 0, 5, 6,
            5, 0, 4, 5, 4, 9,
            6, 5, 10, 6, 10, 11,
        ]);
        cube.num_vertices = 14;
        cube.num_indices = 36;
        return cube;
    }
    add_vertex(position, texcoord) {
        this.positions.set(position, this.num_vertices * 3);
        this.tex_coords.set(texcoord, this.num_vertices * 2);
        this.num_vertices += 1;
    }
    add_face(indices) {
        this.indices.set(indices, this.num_indices);
        this.num_indices += indices.length;
    }
    webgl_set_uniforms(_wgl) { }
    webgl_create(webgl) {
        this.position_buf = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, this.position_buf);
        webgl.bufferData(webgl.ARRAY_BUFFER, this.positions.buffer, webgl.STATIC_DRAW);
        this.tex_coord_buf = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, this.tex_coord_buf);
        webgl.bufferData(webgl.ARRAY_BUFFER, this.tex_coords.buffer, webgl.STATIC_DRAW);
        this.indices_buf = webgl.createBuffer();
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indices_buf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, this.indices.buffer, webgl.STATIC_DRAW);
    }
    webgl_draw(webgl) {
        webgl.bindBuffer(webgl.ARRAY_BUFFER, this.position_buf);
        webgl.enableVertexAttribArray(0);
        webgl.vertexAttribPointer(0, 3, webgl.FLOAT, false, 0, 0);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, this.tex_coord_buf);
        webgl.enableVertexAttribArray(1);
        webgl.vertexAttribPointer(1, 2, webgl.FLOAT, false, 0, 0);
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indices_buf);
        webgl.drawElements(webgl.TRIANGLES, this.num_indices, webgl.UNSIGNED_SHORT, 0);
    }
}
exports.Webgl3DObj = Webgl3DObj;
//# sourceMappingURL=web_gl_3d_obj.js.map