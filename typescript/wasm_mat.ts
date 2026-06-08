import { set_scale_add_scaled, is_zero } from "./vector.js";
interface WasmMat {
  // static zero(): this;
  // static idemtity(): this;
  clone(): this;

  is_zero(): boolean;

  /*  determinant(): number;

  set_identity(): void;
  set_inverse(): boolean;
  set_transpose(): void;

  set_add(other: this): void;
  set_sub(other: this): void;
  set_mul(other: this): void;
  set_mulf(scale: number): void;
  set_divf(scale: number): void;
*/
  /*
              pub fn identity() -> $t {
              pub fn from_array(f: &[$f]) -> $t {
              pub fn set_array(&mut self, f: &[$f]) {
              pub fn buffer(&mut self) -> *mut $f {
              pub fn array(&self) -> Box<[$f]> {

              pub fn perspective(fov: $f, aspect: $f, near: $f, far: $f) -> $t {
              pub fn set_perspective(&mut self, fov: $f, aspect: $f, near: $f, far: $f) {
              pub fn look_at(eye: &$v3, center: &$v3, up: &$v3) -> $t {
              pub fn set_look_at(&mut self, eye: &$v3, center: &$v3, up: &$v3) {
              pub fn set_translate_by_vec3(&mut self, by: &$v3) {
              pub fn set_scale3(&mut self, by: $f) {
              pub fn set_translate_by_vec4(&mut self, by: &$v4) {

*/
}

export class Matrix {
  data: number[];
  constructor() {
    this.data = [];
  }
  set(array: ArrayLike<number>) {
    for (var i = 0; i < this.data.length; i++) {
      this.data[i] = array[i]!;
    }
  }
  clone(): this {
    const x = new (this.constructor as new () => this)();
    x.data = this.data.slice();
    return x;
  }
  is_zero(): boolean {
    return is_zero(this.data);
  }
  set_scale_add_scaled(scale: number, other: this, oscale: number): void {
    return set_scale_add_scaled(this.data, scale, other.data, oscale);
  }
}
export class WasmMatBase implements WasmMat {
  private m: Matrix = new Matrix();
  clone(): this {
    const t = new (this.constructor as new () => this)();
    t.m = this.m.clone();
    return t as this;
  }
  add(other: this): this {
    const r = this.clone();
    r.m.set_scale_add_scaled(1.0, other.m, 1.0);
    return r;
  }
  is_zero(): boolean {
    return this.m.is_zero();
  }
}
