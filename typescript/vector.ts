import { set_scale_add_scaled, dot, is_zero } from "./test_utils.js";
import { LocalArrayType } from "./test_utils.js";

import { Quaternion } from "./quaternion.js";

export class Vector<A extends LocalArrayType> {
  data!: A;
  dims: number = 1;
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
    return set_scale_add_scaled(this.data as any, scale, other.data, oscale);
  }

  get is_zero(): boolean {
    return is_zero(this.data);
  }

  get length_sq(): number {
    return dot(this.data, this.data);
  }

  get length(): number {
    return Math.sqrt(this.length_sq);
  }

  dot(other: this): number {
    return dot(this.data, other.data);
  }

  set_normalized(): void {
    const l = this.length;
    this.set_mulf(1.0 / l);
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

  distance_sq(other: this): number {
    const x = this.clone();
    x.set_scale_add_scaled(1.0, other, -1.0);
    return x.length_sq;
  }

  distance(other: this): number {
    return Math.sqrt(this.distance_sq(other));
  }

  set_mix(other: this, t: number): void {
    this.set_scale_add_scaled(1.0 - t, other, t);
  }

  mix(other: this, t: number): this {
    const r = this.clone();
    r.set_mix(other, t);
    return r;
  }

  // was mul_assign_q
  set_premul_q(q: Quaternion) {
    const vq = Quaternion.of_rijk([
      0,
      this.data[0]!,
      this.data[1]!,
      this.data[2]!,
    ]);
    const r = q.clone().mul_assign_q(vq).mul_assign_q(q.clone_conjugate());
    this.data[0] = r.rijk[1];
    this.data[1] = r.rijk[2];
    this.data[2] = r.rijk[3];
  }

  add(other: this): this {
    const r = this.clone();
    r.set_add(other);
    return r;
  }
}

export class Vec3<A extends LocalArrayType> extends Vector<A> {}
