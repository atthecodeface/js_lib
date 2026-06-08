import { WasmVecBase, WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";
import { dot } from "./vector.js";
import { Quaternion } from "./quaternion.js";

interface WasmQuat<V extends WasmVecBase> {
  // static zero(): this;
  // static idemtity(): this;
  clone(): this;

  // new(i: $f, j: $f, k: $f, r: $f) -> $t {
  //  unit() -> $t {

  // pub fn of_axis_angle(axis: &$v, angle: $f) -> $t {
  // pub fn look_at(dirn: & $v, up: & $v) -> $t {
  // pub fn mapping_vector_pair_to_vector_pair(
  // pub fn rotation_of_vec_to_vec(a: & $v, b: & $v) -> $t {
  //   pub fn array(&self) -> Box < [$f] > {
  // pub fn buffer(&mut self) -> *mut $f {

  get r(): number;
  get i(): number;
  get j(): number;
  get k(): number;
  set r(v: number);
  set i(v: number);
  set j(v: number);
  set k(v: number);

  get rijk(): [number, number, number, number];
  set rijk(v: [number, number, number, number]);

  get length_sq(): number;
  get length(): number;

  set(i: number, j: number, k: number, r: number): void;
  set_unit(): void;
  set_neg(): void;
  set_normalized(): void;
  set_conjugate(): void;
  set_add(other: this): void;
  set_sub(other: this): void;
  // q <- q * other
  set_mul(other: this): void;
  // q <- q * other'
  set_div(other: this): void;
  // q <- other * q
  set_premul(other: this): void;
  // q <- other * q'
  set_prediv(other: this): void;
  set_mulf(scale: number): void;
  set_divf(scale: number): void;

  dot(other: this): number;
  distance_sq(other: this): number;
  distance(other: this): number;

  // self <- self * rotate(Axis, angle)
  set_mul_rotate_x(angle: number): void;
  set_mul_rotate_y(angle: number): void;
  set_mul_rotate_z(angle: number): void;

  // self <- rotate(Axis, angle) * self
  // This is the one you usually want
  set_premul_rotate_x(angle: number): void;
  set_premul_rotate_y(angle: number): void;
  set_premul_rotate_z(angle: number): void;

  // Axis need not be a unit vector
  set_of_axis_angle(v0: V, angle: number): void;
  // Must be unit vectors
  set_rotation_of_vec_to_vec(v0: V, v1: V): void;
  set_mapping_vector_pair_to_vector_pair(
    di_m: V,
    dj_m: V,
    di_c: V,
    dj_c: V,
  ): void;

  apply_vec(v: V): V;
  apply_set_vec(v: V): void;

  // These are less methods to have as they must allocate; do not expose them generally
  // neg(): this;
  // add(other: this): this;
  // sub(other: this): this;
  // mul(other: this): this;
  // div(other: this): this;
  // mulf(scale: number): this;
  // divf(scale: number): this;
  // conjugate(): this;
  // normalize() : this;

  // self <- self * rotate(Axis, angle)
  // pub fn set_mul_rotate_x(&mut self, angle: $f) {
  // pub fn set_mul_rotate_y(&mut self, angle: $f) {
  // pub fn set_mul_rotate_z(&mut self, angle: $f) {

  // self <- rotate(Axis, angle) * self
  // This is the one you usually want
  // set_premul_rotate_x(angle: $f): void
  // set_premul_rotate_y(angle: $f): void
  // set_premul_rotate_z(angle: $f): void

  // pub fn set_rotation_of_vec_to_vec(&mut self, a: &$v, b: &$v) {
  // pub fn set_mapping_vector_pair_to_vector_pair(

  // pub fn mat3_set_rotation(&self, m: &mut $m3) {
  // pub fn mat4_set_rotation(&self, m: &mut $m4) {
  // pub fn average(
  // static average_many(qs: WasmQuatf32[]): WasmQuatf32;
  // pub fn average_many(qs: Vec<Self>) -> Self {
  // pub fn set_array(&mut self, array: &[$f]) {
}

class WasmQuatBase<V extends WasmVecBase> implements WasmQuat<V> {
  private q: Quaternion;

  constructor(i: number = 0, j: number = 0, k: number = 0, r: number = 1) {
    this.q = Quaternion.of_rijk([r, i, j, k]);
  }
  clone(): this {
    const q = new (this.constructor as new () => this)();
    q.q = this.q.clone();
    return q;
  }

  get r(): number {
    return this.q.rijk[0];
  }
  get i(): number {
    return this.q.rijk[1];
  }
  get j(): number {
    return this.q.rijk[2];
  }
  get k(): number {
    return this.q.rijk[3];
  }
  set r(v: number) {
    this.q.rijk[0] = v;
  }
  set i(v: number) {
    this.q.rijk[1] = v;
  }
  set j(v: number) {
    this.q.rijk[2] = v;
  }
  set k(v: number) {
    this.q.rijk[3] = v;
  }

  get rijk(): [number, number, number, number] {
    return this.q.rijk;
  }
  set rijk(v: [number, number, number, number]) {
    this.q.rijk = v;
  }

  get length_sq(): number {
    return this.q.length_sq();
  }
  get length(): number {
    return Math.sqrt(this.q.length_sq());
  }

  set(i: number, j: number, k: number, r: number): void {
    this.q.rijk = [r, i, j, k];
  }
  set_unit(): void {
    this.set(0, 0, 0, 1);
  }
  set_neg(): void {
    this.q.set_scale_add_scaled(-1.0, this.q, 0.0);
  }
  set_normalized(): void {
    this.q.normalize();
  }
  set_conjugate(): void {
    this.q.set_conjugate();
  }
  set_add(other: this): void {
    this.q.set_scale_add_scaled(1.0, other.q, 1.0);
  }
  set_sub(other: this): void {
    this.q.set_scale_add_scaled(1.0, other.q, -1.0);
  }
  set_mul(other: this): void {
    this.q.mul_assign_q(other.q);
  }
  set_div(other: this): void {
    const qc = other.q.clone_conjugate();
    this.q.mul_assign_q(qc);
  }
  set_premul(other: this): void {
    const q = other.q.clone();
    q.mul_assign_q(this.q);
    this.q = q;
  }
  set_prediv(other: this): void {
    const q = other.q.clone();
    q.mul_assign_q(this.q.clone_conjugate());
    this.q = q;
  }

  set_mulf(scale: number): void {
    this.q.set_scale_add_scaled(scale, this.q, 0.0);
  }
  set_divf(scale: number): void {
    this.q.set_scale_add_scaled(1.0 / scale, this.q, 0.0);
  }

  set_mul_rotate_x(angle: number) {
    const q = this.q.clone();
    q.set_of_axis_angle([1, 0, 0], angle);
    this.q.mul_assign_q(q);
  }
  set_mul_rotate_y(angle: number) {
    const q = this.q.clone();
    q.set_of_axis_angle([0, 1, 0], angle);
    this.q.mul_assign_q(q);
  }
  set_mul_rotate_z(angle: number) {
    const q = this.q.clone();
    q.set_of_axis_angle([0, 0, 1], angle);
    this.q.mul_assign_q(q);
  }

  // self <- rotate(Axis, angle) * self
  // This is the one you usually want
  set_premul_rotate_x(angle: number) {
    const q = this.q.clone();
    q.set_of_axis_angle([1, 0, 0], angle);
    q.mul_assign_q(this.q);
    this.q = q;
  }
  set_premul_rotate_y(angle: number) {
    const q = this.q.clone();
    q.set_of_axis_angle([0, 1, 0], angle);
    q.mul_assign_q(this.q);
    this.q = q;
  }

  set_premul_rotate_z(angle: number) {
    const q = this.q.clone();
    q.set_of_axis_angle([0, 0, 1], angle);
    q.mul_assign_q(this.q);
    this.q = q;
  }

  dot(other: this): number {
    return dot(this.q.rijk, other.q.rijk);
  }
  distance_sq(other: this): number {
    return this.q.distance_sq(other.q);
  }
  distance(other: this): number {
    return Math.sqrt(this.distance_sq(other));
  }

  apply_set_vec(v: V): void {
    const [x, y, z] = this.q.apply_vec(v._v().xyz);
    v._v().xyz = [x, y, z];
  }
  apply_vec(v: V): V {
    const r = v.clone();
    this.apply_set_vec(r);
    return r;
  }

  set_of_axis_angle(v: V, angle: number) {
    this.q.set_of_axis_angle(
      [v._v().xyz[0]!, v._v().xyz[1]!, v._v().xyz[2]!],
      angle,
    );
  }

  set_rotation_of_vec_to_vec(v0: V, v1: V): void {
    this.q.set_rotation_of_vec_to_vec(v0._v().xyz, v1._v().xyz);
  }

  set_mapping_vector_pair_to_vector_pair(
    di_m: V,
    dj_m: V,
    di_c: V,
    dj_c: V,
  ): void {
    this.q.set_mapping_vector_pair_to_vector_pair(
      di_m._v().xyz,
      dj_m._v().xyz,
      di_c._v().xyz,
      dj_c._v().xyz,
    );
  }

  // Try not to use these...
  conjugate(): this {
    const q = this.clone();
    q.q = this.q.clone_conjugate();
    return q;
  }
  mul(other: this): this {
    const q = this.clone();
    q.q = this.q.clone().mul_assign_q(other.q);
    return q;
  }
  div(other: this): this {
    const q = this.clone();
    q.q = this.q.clone().mul_assign_q(other.q.clone_conjugate());
    return q;
  }
  set_mat4(mat: Float32Array) {
    mat.set(this.q.as_mat4());
  }

  _quaternion(): Quaternion {
    return this.q;
  }
  _set_quaternion(q: Quaternion): void {
    this.q = q;
  }
}

export class WasmQuatf32
  extends WasmQuatBase<WasmVec3f32>
  implements WasmQuat<WasmVec3f32>
{
  // @ts-ignore
  readonly buffer: number;
  static unit(): WasmQuatf32 {
    return new WasmQuatf32();
  }
  static of_axis_angle(axis: WasmVec3f32, angle: number): WasmQuatf32 {
    const q = new WasmQuatf32();
    q.set_of_axis_angle(axis, angle);
    return q;
  }
}

export class WasmQuatf64
  extends WasmQuatBase<WasmVec3f64>
  implements WasmQuat<WasmVec3f64>
{
  // @ts-ignore
  readonly buffer: number;
}
