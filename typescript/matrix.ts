import { set_scale_add_scaled, is_zero } from "./vector.js";
import { WasmVec } from "./wasm_vec.js";

// This helps with type checking; it is implemented magically by Float32Array and Float64Array
interface LocalArrayType {
  get length(): number;
  slice(): this;
  [index: number]: number;
  set(array: ArrayLike<number>): void;
}

export class Matrix<A extends LocalArrayType> {
  data!: A;
  rows: number = 1;
  cols: number = 1;
  constructor() {}

  get array(): A {
    return this.data;
  }

  set_array(array: A) {
    this.data = array.slice();
  }

  clone(): this {
    const x = new (this.constructor as new () => this)();
    x.data = this.data.slice();
    return x;
  }

  set_scale_add_scaled(scale: number, other: this, oscale: number): void {
    return set_scale_add_scaled(
      this.data as any,
      scale,
      other.data as any,
      oscale,
    );
  }
}

export class MatrixBase<
  A extends LocalArrayType,
  V extends WasmVec<A>,
> extends Matrix<A> {
  get is_zero(): boolean {
    return is_zero(this.data);
  }

  set_inverse(_other: this): boolean {
    return false;
  }
  invert(): boolean {
    const r = this.clone();
    return this.set_inverse(r);
  }
  transpose(): void {
    const r = this.clone();
    this.set_transpose(r);
  }

  set_zero(): void {
    return this.set_scale_add_scaled(0.0, this, 0.0);
  }
  set_neg(): void {
    return this.set_scale_add_scaled(-1.0, this, 0.0);
  }
  set_add(other: this): void {
    return this.set_scale_add_scaled(1.0, other, 1.0);
  }
  set_sub(other: this): void {
    return this.set_scale_add_scaled(1.0, other, -1.0);
  }
  set_mulf(scale: number): void {
    return this.set_scale_add_scaled(scale, this, 0.0);
  }
  set_divf(scale: number): void {
    return this.set_scale_add_scaled(1.0 / scale, this, 0.0);
  }

  set_identity(): void {
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.rows; j += 1) {
        this.data[i + j * this.cols] = Number(i == j);
      }
    }
  }
  set_transpose(other: this): void {
    const m = other.data;
    const r = this.data;
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.rows; j += 1) {
        r[i + j * this.cols] = m[j + i * this.cols]!;
      }
    }
  }
  set_mul(other: this): void {
    // This operates for square matrices as it clones data to get the correct array size,
    //  but ignoring that it operates provided this.cols == other.rows
    const clone = this.data.slice();
    for (let r = 0; r < this.rows; r += 1) {
      let value = 0;
      for (let c = 0; c < this.cols; c += 1) {
        for (let k = 0; k < this.cols; k += 1) {
          value += clone[k + r * this.cols]! * other.data[c + k * other.cols]!;
        }
        this.data[c + r * this.cols] = value;
      }
    }
  }

  mul_set_vec(v: V): void {
    const rv = this.mul_vec(v);
    v.set_array(rv.array);
  }

  mul_vec(v: V): V {
    const rv = v.clone();
    const v_array = v.array;
    const rv_array = rv.array;
    for (let r = 0; r < this.rows; r += 1) {
      let value = 0;
      for (let c = 0; c < this.cols; c += 1) {
        value += this.data[c + r * this.cols]! * v_array[c]!;
      }
      rv_array[r] = value;
    }
    rv.set_array(rv_array);
    return rv;
  }
}

export class Matrix2<
  A extends LocalArrayType,
  V extends WasmVec<A>,
> extends MatrixBase<A, V> {
  override rows: number = 2;
  override cols: number = 2;
  determinant(): number {
    return this.data[0]! * this.data[3]! - this.data[1]! * this.data[2]!;
  }

  override set_inverse(other: this): boolean {
    const d = other.determinant();
    if (Math.abs(d) < 1e-6) {
      return false;
    }
    const m = other.data;
    this.data[0] = m[3]! / d;
    this.data[1] = -m[1]! / d;
    this.data[2] = -m[2]! / d;
    this.data[3] = m[0]! / d;
    return true;
  }
}

export class Matrix3<
  A extends LocalArrayType,
  V extends WasmVec<A>,
> extends MatrixBase<A, V> {
  override rows: number = 3;
  override cols: number = 3;
  determinant(): number {
    const m = this.data;
    return (
      m[0]! * (m[4]! * m[8]! - m[5]! * m[7]!) +
      m[1]! * (m[5]! * m[6]! - m[3]! * m[8]!) +
      m[2]! * (m[3]! * m[7]! - m[4]! * m[6]!)
    );
  }

  override set_inverse(other: this): boolean {
    const d = other.determinant();
    if (Math.abs(d) < 1e-6) {
      return false;
    }
    const r_d = 1.0 / d;
    const m = other.data;
    const r = this.data;
    r[0] = (m[3 + 1]! * m[6 + 2]! - m[3 + 2]! * m[6 + 1]!) * r_d;
    r[3] = (m[3 + 2]! * m[6 + 0]! - m[3 + 0]! * m[6 + 2]!) * r_d;
    r[6] = (m[3 + 0]! * m[6 + 1]! - m[3 + 1]! * m[6 + 0]!) * r_d;

    r[1] = (m[6 + 1]! * m[0 + 2]! - m[6 + 2]! * m[0 + 1]!) * r_d;
    r[4] = (m[6 + 2]! * m[0 + 0]! - m[6 + 0]! * m[0 + 2]!) * r_d;
    r[7] = (m[6 + 0]! * m[0 + 1]! - m[6 + 1]! * m[0 + 0]!) * r_d;

    r[2] = (m[0 + 1]! * m[3 + 2]! - m[0 + 2]! * m[3 + 1]!) * r_d;
    r[5] = (m[0 + 2]! * m[3 + 0]! - m[0 + 0]! * m[3 + 2]!) * r_d;
    r[8] = (m[0 + 0]! * m[3 + 1]! - m[0 + 1]! * m[3 + 0]!) * r_d;
    return true;
  }
}

export class Matrix4<
  A extends LocalArrayType,
  V extends WasmVec<A>,
> extends MatrixBase<A, V> {
  override rows: number = 4;
  override cols: number = 4;
  determinant(): number {
    const m = this.data;
    let det0 =
      m[0]! *
      (m[4 + 1]! * (m[8 + 2]! * m[12 + 3]! - m[8 + 3]! * m[12 + 2]!) +
        m[4 + 2]! * (m[8 + 3]! * m[12 + 1]! - m[8 + 1]! * m[12 + 3]!) +
        m[4 + 3]! * (m[8 + 1]! * m[12 + 2]! - m[8 + 2]! * m[12 + 1]!));
    let det1 =
      m[1]! *
      (m[4 + 2]! * (m[8 + 3]! * m[12 + 0]! - m[8 + 0]! * m[12 + 3]!) +
        m[4 + 3]! * (m[8 + 0]! * m[12 + 2]! - m[8 + 2]! * m[12 + 0]!) +
        m[4 + 0]! * (m[8 + 2]! * m[12 + 3]! - m[8 + 3]! * m[12 + 2]!));
    let det2 =
      m[2]! *
      (m[4 + 3]! * (m[8 + 0]! * m[12 + 1]! - m[8 + 1]! * m[12 + 0]!) +
        m[4 + 0]! * (m[8 + 1]! * m[12 + 3]! - m[8 + 3]! * m[12 + 1]!) +
        m[4 + 1]! * (m[8 + 3]! * m[12 + 0]! - m[8 + 0]! * m[12 + 3]!));
    let det3 =
      m[3]! *
      (m[4 + 0]! * (m[8 + 1]! * m[12 + 2]! - m[8 + 2]! * m[12 + 1]!) +
        m[4 + 1]! * (m[8 + 2]! * m[12 + 0]! - m[8 + 0]! * m[12 + 2]!) +
        m[4 + 2]! * (m[8 + 0]! * m[12 + 1]! - m[8 + 1]! * m[12 + 0]!));
    return det0 - det1 + det2 - det3;
  }
  override set_inverse(other: this): boolean {
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
          ((m[a + x]! * m[b + y]! - m[b + x]! * m[a + y]!) * m[c + z]! +
            (m[a + y]! * m[b + z]! - m[b + y]! * m[a + z]!) * m[c + x]! +
            (m[a + z]! * m[b + x]! - m[b + z]! * m[a + x]!) * m[c + y]!) *
          sc *
          r_d;
      }
    }
    return true;
  }
}
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
