"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix4 = exports.Matrix3 = exports.Matrix2 = exports.MatrixBase = exports.Matrix = void 0;
const test_utils_js_1 = require("./test_utils.js");
class Matrix {
    constructor() {
        this.rows = 1;
        this.cols = 1;
    }
    get array() {
        return this.data;
    }
    set_array(array) {
        this.data = array.slice();
    }
    clone() {
        const x = new this.constructor();
        x.data = this.data.slice();
        return x;
    }
    set_scale_add_scaled(scale, other, oscale) {
        return (0, test_utils_js_1.set_scale_add_scaled)(this.data, scale, other.data, oscale);
    }
}
exports.Matrix = Matrix;
class MatrixBase extends Matrix {
    get is_zero() {
        return (0, test_utils_js_1.is_zero)(this.data);
    }
    set_inverse(_other) {
        return false;
    }
    invert() {
        const r = this.clone();
        return this.set_inverse(r);
    }
    transpose() {
        const r = this.clone();
        this.set_transpose(r);
    }
    set_zero() {
        return this.set_scale_add_scaled(0.0, this, 0.0);
    }
    set_neg() {
        return this.set_scale_add_scaled(-1.0, this, 0.0);
    }
    set_add(other) {
        return this.set_scale_add_scaled(1.0, other, 1.0);
    }
    set_sub(other) {
        return this.set_scale_add_scaled(1.0, other, -1.0);
    }
    set_mulf(scale) {
        return this.set_scale_add_scaled(scale, this, 0.0);
    }
    set_divf(scale) {
        return this.set_scale_add_scaled(1.0 / scale, this, 0.0);
    }
    set_identity() {
        for (let i = 0; i < this.rows; i += 1) {
            for (let j = 0; j < this.rows; j += 1) {
                this.data[i + j * this.cols] = Number(i == j);
            }
        }
    }
    set_transpose(other) {
        const m = other.data;
        const r = this.data;
        for (let i = 0; i < this.rows; i += 1) {
            for (let j = 0; j < this.rows; j += 1) {
                r[i + j * this.cols] = m[j + i * this.cols];
            }
        }
    }
    set_mul(other) {
        // This operates for square matrices as it clones data to get the correct array size,
        //  but ignoring that it operates provided this.cols == other.rows
        const clone = this.data.slice();
        for (let r = 0; r < this.rows; r += 1) {
            let value = 0;
            for (let c = 0; c < this.cols; c += 1) {
                for (let k = 0; k < this.cols; k += 1) {
                    value += clone[k + r * this.cols] * other.data[c + k * other.cols];
                }
                this.data[c + r * this.cols] = value;
            }
        }
    }
    mul_set_vec(v) {
        const rv = this.mul_vec(v);
        v.set_array(rv.array);
    }
    mul_vec(v) {
        const rv = v.clone();
        const v_array = v.array;
        const rv_array = rv.array;
        for (let r = 0; r < this.rows; r += 1) {
            let value = 0;
            for (let c = 0; c < this.cols; c += 1) {
                value += this.data[c + r * this.cols] * v_array[c];
            }
            rv_array[r] = value;
        }
        rv.set_array(rv_array);
        return rv;
    }
}
exports.MatrixBase = MatrixBase;
class Matrix2 extends MatrixBase {
    constructor() {
        super(...arguments);
        this.rows = 2;
        this.cols = 2;
    }
    determinant() {
        return this.data[0] * this.data[3] - this.data[1] * this.data[2];
    }
    set_inverse(other) {
        const d = other.determinant();
        if (Math.abs(d) < 1e-6) {
            return false;
        }
        const m = other.data;
        this.data[0] = m[3] / d;
        this.data[1] = -m[1] / d;
        this.data[2] = -m[2] / d;
        this.data[3] = m[0] / d;
        return true;
    }
}
exports.Matrix2 = Matrix2;
class Matrix3 extends MatrixBase {
    constructor() {
        super(...arguments);
        this.rows = 3;
        this.cols = 3;
    }
    determinant() {
        const m = this.data;
        return (m[0] * (m[4] * m[8] - m[5] * m[7]) +
            m[1] * (m[5] * m[6] - m[3] * m[8]) +
            m[2] * (m[3] * m[7] - m[4] * m[6]));
    }
    set_inverse(other) {
        const d = other.determinant();
        if (Math.abs(d) < 1e-6) {
            return false;
        }
        const r_d = 1.0 / d;
        const m = other.data;
        const r = this.data;
        r[0] = (m[3 + 1] * m[6 + 2] - m[3 + 2] * m[6 + 1]) * r_d;
        r[3] = (m[3 + 2] * m[6 + 0] - m[3 + 0] * m[6 + 2]) * r_d;
        r[6] = (m[3 + 0] * m[6 + 1] - m[3 + 1] * m[6 + 0]) * r_d;
        r[1] = (m[6 + 1] * m[0 + 2] - m[6 + 2] * m[0 + 1]) * r_d;
        r[4] = (m[6 + 2] * m[0 + 0] - m[6 + 0] * m[0 + 2]) * r_d;
        r[7] = (m[6 + 0] * m[0 + 1] - m[6 + 1] * m[0 + 0]) * r_d;
        r[2] = (m[0 + 1] * m[3 + 2] - m[0 + 2] * m[3 + 1]) * r_d;
        r[5] = (m[0 + 2] * m[3 + 0] - m[0 + 0] * m[3 + 2]) * r_d;
        r[8] = (m[0 + 0] * m[3 + 1] - m[0 + 1] * m[3 + 0]) * r_d;
        return true;
    }
}
exports.Matrix3 = Matrix3;
class Matrix4 extends MatrixBase {
    constructor() {
        super(...arguments);
        this.rows = 4;
        this.cols = 4;
    }
    determinant() {
        const m = this.data;
        let det0 = m[0] *
            (m[4 + 1] * (m[8 + 2] * m[12 + 3] - m[8 + 3] * m[12 + 2]) +
                m[4 + 2] * (m[8 + 3] * m[12 + 1] - m[8 + 1] * m[12 + 3]) +
                m[4 + 3] * (m[8 + 1] * m[12 + 2] - m[8 + 2] * m[12 + 1]));
        let det1 = m[1] *
            (m[4 + 2] * (m[8 + 3] * m[12 + 0] - m[8 + 0] * m[12 + 3]) +
                m[4 + 3] * (m[8 + 0] * m[12 + 2] - m[8 + 2] * m[12 + 0]) +
                m[4 + 0] * (m[8 + 2] * m[12 + 3] - m[8 + 3] * m[12 + 2]));
        let det2 = m[2] *
            (m[4 + 3] * (m[8 + 0] * m[12 + 1] - m[8 + 1] * m[12 + 0]) +
                m[4 + 0] * (m[8 + 1] * m[12 + 3] - m[8 + 3] * m[12 + 1]) +
                m[4 + 1] * (m[8 + 3] * m[12 + 0] - m[8 + 0] * m[12 + 3]));
        let det3 = m[3] *
            (m[4 + 0] * (m[8 + 1] * m[12 + 2] - m[8 + 2] * m[12 + 1]) +
                m[4 + 1] * (m[8 + 2] * m[12 + 0] - m[8 + 0] * m[12 + 2]) +
                m[4 + 2] * (m[8 + 0] * m[12 + 1] - m[8 + 1] * m[12 + 0]));
        return det0 - det1 + det2 - det3;
    }
    set_inverse(other) {
        const d = other.determinant();
        if (Math.abs(d) < 1e-6) {
            return false;
        }
        const r_d = 1.0 / d;
        const m = other.data;
        const r = this.data;
        for (let j = 0; j < 4; j++) {
            let a = ((j + 1) & 3) * 4;
            let b = ((j + 2) & 3) * 4;
            let c = ((j + 3) & 3) * 4;
            for (let i = 0; i < 4; i++) {
                let x = (i + 1) & 3;
                let y = (i + 2) & 3;
                let z = (i + 3) & 3;
                let sc = -1.0;
                if (((i + j) & 1) == 0) {
                    sc = 1.0;
                }
                r[i * 4 + j] =
                    ((m[a + x] * m[b + y] - m[b + x] * m[a + y]) * m[c + z] +
                        (m[a + y] * m[b + z] - m[b + y] * m[a + z]) * m[c + x] +
                        (m[a + z] * m[b + x] - m[b + z] * m[a + x]) * m[c + y]) *
                        sc *
                        r_d;
            }
        }
        return true;
    }
}
exports.Matrix4 = Matrix4;
/*
export class WasmMat2f32
  extends Matrix2<Float32Array>
  implements WasmMat<Float32Array, WasmVec2f32>
{
  constructor() {
    super();
    this.data = new Float32Array(2 * 2);
  }
}
 */
//# sourceMappingURL=matrix.js.map