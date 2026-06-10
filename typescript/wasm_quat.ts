import { WasmVec3, WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";
import { LocalArrayType, dot } from "./test_utils.js";
import { Quaternion } from "./quaternion.js";

export interface WasmQuat<A extends LocalArrayType, V extends WasmVec3<A>> {
  // constructor new(i: $f, j: $f, k: $f, r: $f) -> $t {

  // static average(q0: this, q1: this, q2?: this | null, q3?: this | null, q4?: this | null, q5?: this | null): this;
  // static average_many(qs: this[]): this;
  // static look_at(dirn: V, up: V): this;
  // static mapping_vector_pair_to_vector_pair(di_m: V, dj_m: V, di_c: V, dj_c: V): this;
  /**
   * The axis need not be a unit vector; angle is in radians
   */
  // static of_axis_angle(axis: V, angle: number): this;
  // static rotation_of_vec_to_vec(a: V, b: V): this;
  // static unit(): this;

  clone(): this;

  get r(): number;
  get i(): number;
  get j(): number;
  get k(): number;
  set r(v: number);
  set i(v: number);
  set j(v: number);
  set k(v: number);
  get length_sq(): number;
  get length(): number;

  get array(): A;
  get buffer(): number;

  // These are less methods to have as they must allocate; do not expose them generally
  // conjugated(): this; // change wasm to conjugated from conjugate
  // div(other: this): this;
  // divf(f: number): this;
  // mul(other: this): this;
  // mulf(f: number): this;
  // neg(): this;
  // normalize(): this;// change wasm to normalized from normalize
  // Remove add and sub from Wasm

  apply_set_vec(v: V): void;
  apply_vec(v: V): V;

  distance(other: this): number;
  distance_sq(other: this): number;
  dot(other: this): number;

  // mat3_set_rotation(m: WasmMat3f32): void;
  // mat4_set_rotation(m: WasmMat4f32): void;

  set_unit(): void;
  set(i: number, j: number, k: number, r: number): void;
  set_array(array: A): void;
  set_neg(): void;
  set_normalized(): void;
  set_conjugate(): void;

  // This is rarely what you want; it helps with testing though
  // q <- q + other
  set_add(other: this): void;
  // This is rarely what you want
  // q <- q - other
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

  set_mul(other: this): void;
  set_div(other: this): void;
  set_prediv(other: this): void;
  set_premul(other: this): void;
  set_divf(f: number): void;
  set_mulf(f: number): void;

  // self < = self * rotate(x, angle)
  set_mul_rotate_x(angle: number): void;
  // self < = self * rotate(y, angle)
  set_mul_rotate_y(angle: number): void;
  // self < = self * rotate(z, angle)
  set_mul_rotate_z(angle: number): void;
  // self < = rotate(x, angle) * self
  // This is the one you usually want
  set_premul_rotate_x(angle: number): void;
  // self < = rotate(y, angle) * self
  // This is the one you usually want
  set_premul_rotate_y(angle: number): void;
  // self < = rotate(z, angle) * self
  // This is the one you usually want
  set_premul_rotate_z(angle: number): void;

  // Axis need not be a unit vector
  set_of_axis_angle(axis: V, angle: number): void;
  // Must be unit vectors
  set_rotation_of_vec_to_vec(a: V, b: V): void;
  // Vectors are of any length in the two different spaces, but presumably di_m
  // and di_c have the same length, and dj_m and dj_c have the same length
  set_mapping_vector_pair_to_vector_pair(
    di_m: V,
    dj_m: V,
    di_c: V,
    dj_c: V,
  ): void;

  // ORIGINAL
  //
  // get rijk(): [number, number, number, number];  Remove from js_lib - must get individually or use array
  // set rijk(v: [number, number, number, number]); Remove from js_lib - use set_array() or set(i,j,k,r)
}

abstract class WasmQuatBase<
  A extends LocalArrayType,
  V extends WasmVec3<A>,
> implements WasmQuat<A, V> {
  private q: Quaternion;

  constructor(i: number = 0, j: number = 0, k: number = 0, r: number = 1) {
    this.q = Quaternion.of_rijk([r, i, j, k]);
  }

  // Must override this
  get array(): A {
    return null!;
  }

  get buffer(): number {
    return 0;
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
  set_array(a: ArrayLike<number>): void {
    this._quaternion().rijk = [a[0]!, a[1]!, a[2]!, a[3]!];
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
    const [x, y, z] = this.q.apply_vec(v.data);
    v.data.set([x, y, z]);
  }

  apply_vec(v: V): V {
    const r = v.clone();
    this.apply_set_vec(r);
    return r;
  }

  set_of_axis_angle(v: V, angle: number) {
    this.q.set_of_axis_angle([v.data[0]!, v.data[1]!, v.data[2]!], angle);
  }

  set_rotation_of_vec_to_vec(v0: V, v1: V): void {
    this.q.set_rotation_of_vec_to_vec(v0.data, v1.data);
  }

  set_mapping_vector_pair_to_vector_pair(
    di_m: V,
    dj_m: V,
    di_c: V,
    dj_c: V,
  ): void {
    this.q.set_mapping_vector_pair_to_vector_pair(
      di_m.data,
      dj_m.data,
      di_c.data,
      dj_c.data,
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
  extends WasmQuatBase<Float32Array, WasmVec3f32>
  implements WasmQuat<Float32Array, WasmVec3f32>
{
  static unit(): WasmQuatf32 {
    return new WasmQuatf32();
  }
  static of_axis_angle(axis: WasmVec3f32, angle: number): WasmQuatf32 {
    const q = new WasmQuatf32();
    q.set_of_axis_angle(axis, angle);
    return q;
  }
  override get array(): Float32Array {
    return new Float32Array(this._quaternion().rijk);
  }
}

export class WasmQuatf64
  extends WasmQuatBase<Float64Array, WasmVec3f64>
  implements WasmQuat<Float64Array, WasmVec3f64>
{
  override get array(): Float64Array {
    return new Float64Array(this._quaternion().rijk);
  }
}
