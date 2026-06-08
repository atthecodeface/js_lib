import { Vector, Vec3 } from "./vector.js";

interface WasmVec {
  // static zero(): this;
  clone(): this;

  is_zero(): boolean;
  get length(): number;
  get length_sq(): number;

  set_zero(): void;
  set_neg(): void;
  set_normalized(): void;
  set_add(other: this): void;
  set_sub(other: this): void;
  set_mulf(scale: number): void;
  set_divf(scale: number): void;

  dot(other: this): number;
  distance_sq(other: this): number;
  distance(other: this): number;
  mix(other: this, t: number): this;
  set_mix(other: this, t: number): void;
  /*              pub fn zero() -> Self {
              pub fn from_array(f: &[$f]) -> $t {
              pub fn array(&self) -> Box<[$f]> {
              pub fn buffer(&mut self) -> *mut $f {
              pub fn set_array(&mut self, array: &[$f]) {
              pub fn neg(&self) -> $t {
              pub fn add(&self, other: &$t) -> $t {
              pub fn sub(&self, other: &$t) -> $t {
              pub fn mulf(&self, f: $f) -> $t {
              pub fn divf(&self, f: $f) -> $t {
              pub fn normalized(&self) -> $t {
              pub fn reduce_sum(&self) -> $f {
              pub fn new(x: $f, y: $f) -> $t {

              pub fn new(x: $f, y: $f, z: $f) -> $t {
              pub fn cross_product(&self, other: &$t) -> $t {
              pub fn set_cross_product(&mut self, other: &$t) {
              pub fn set_apply_q3(&mut self, q: &$q) {

              pub fn new(x: $f, y: $f, z: $f, w: $f) -> $t {
              pub fn set_apply_q4(&mut self, q: $q) {
*/
}

export class WasmVecBase implements WasmVec {
  private v: Vector = new Vector();
  clone(): this {
    const t = new (this.constructor as new () => this)();
    t.v = this.v.clone();
    return t as this;
  }
  add(other: this): this {
    const r = this.clone();
    r.v.set_scale_add_scaled(1.0, other.v, 1.0);
    return r;
  }
  is_zero(): boolean {
    return this.v.is_zero();
  }
  get length(): number {
    return this.v.length();
  }
  get length_sq(): number {
    return this.v.length_sq();
  }

  set_zero(): void {
    return this.v.set_mulf(0.0);
  }
  set_neg(): void {
    return this.v.set_mulf(-1.0);
  }
  set_normalized(): void {
    return this.v.set_normalized();
  }
  set_add(other: this): void {
    return this.v.set_scale_add_scaled(1.0, other.v, 1.0);
  }
  set_sub(other: this): void {
    return this.v.set_scale_add_scaled(1.0, other.v, -1.0);
  }
  set_mulf(scale: number): void {
    return this.v.set_mulf(scale);
  }
  set_divf(scale: number): void {
    return this.v.set_mulf(1.0 / scale);
  }

  dot(other: this): number {
    return this.v.dot(other.v);
  }

  distance_sq(other: this): number {
    return this.v.distance_sq(other.v);
  }
  distance(other: this): number {
    return Math.sqrt(this.distance_sq(other));
  }
  mix(other: this, t: number): this {
    const r = this.clone();
    r.set_mix(other, t);
    return r;
  }
  set_mix(other: this, t: number): void {
    this.v.set_scale_add_scaled(1.0 - t, other.v, t);
  }

  _v(): Vector {
    return this.v;
  }
  _set_v(v: Vector) {
    this.v = v;
  }
}

export class WasmVec3f32 extends WasmVecBase implements WasmVec {
  // @ts-ignore
  readonly buffer: number;
  constructor(x: number, y: number, z: number) {
    super();
    this._set_v(new Vec3(x, y, z));
  }
  static zero(): WasmVec3f32 {
    return new WasmVec3f32(0, 0, 0);
  }
  set(array: Float32Array): void {
    this._v().set(array);
  }
  get array(): Float32Array {
    return new Float32Array(this._v().xyz);
  }
}

export class WasmVec3f64 extends WasmVecBase implements WasmVec {
  // @ts-ignore
  buffer: number;
  constructor(x: number, y: number, z: number) {
    super();
    this._set_v(new Vec3(x, y, z));
  }
  static zero(): WasmVec3f64 {
    return new WasmVec3f64(0, 0, 0);
  }
  set(array: Float64Array): void {
    this._v().set(array);
  }
  get array(): Float64Array {
    return new Float64Array(this._v().xyz);
  }
}
