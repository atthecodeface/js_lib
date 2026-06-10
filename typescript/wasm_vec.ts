import { LocalArrayType } from "./test_utils.js";
import { Vec3 } from "./vector.js";

export interface WasmVec<A> {
  // static zero(): this;
  clone(): this;

  get is_zero(): boolean;
  get length(): number;
  get length_sq(): number;

  set_array(array: ArrayLike<number>): void;
  get array(): A;

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

export class WasmVec3<A extends LocalArrayType> extends Vec3<A> {
  // @ts-ignore
  readonly buffer: number;
}

export class WasmVec3f32
  extends WasmVec3<Float32Array>
  implements WasmVec<Float32Array>
{
  constructor(x: number, y: number, z: number) {
    super();
    this.data = new Float32Array([x, y, z]);
  }
  static zero(): WasmVec3f32 {
    return new WasmVec3f32(0, 0, 0);
  }
}

export class WasmVec3f64
  extends WasmVec3<Float64Array>
  implements WasmVec<Float64Array>
{
  constructor(x: number, y: number, z: number) {
    super();
    this.data = new Float64Array([x, y, z]);
  }
  static zero(): WasmVec3f64 {
    return new WasmVec3f64(0, 0, 0);
  }
}
