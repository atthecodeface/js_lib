export function is_zero(xs: ArrayLike<number>): boolean {
  for (var i = 0; i < xs.length; i++) {
    if (xs[i] != 0) {
      return false;
    }
  }
  return true;
}

export function dot(xs: ArrayLike<number>, oxs: ArrayLike<number>): number {
  var r = 0.0;
  for (var i = 0; i < xs.length; i++) {
    r += xs[i]! * oxs[i]!;
  }
  return r;
}

export function cross_product(
  xs: ArrayLike<number>,
  oxs: ArrayLike<number>,
): [number, number, number] {
  const i0 = xs[0]!;
  const j0 = xs[1]!;
  const k0 = xs[2]!;
  const i1 = oxs[0]!;
  const j1 = oxs[1]!;
  const k1 = oxs[2]!;
  return [j0 * k1 - k0 * j1, k0 * i1 - i0 * k1, i0 * j1 - j0 * i1];
}

export function set_scale_add_scaled(
  xs: number[],
  scale: number,
  oxs: ArrayLike<number>,
  oscale: number,
): void {
  for (var i = 0; i < xs.length; i++) {
    xs[i]! = xs[i]! * scale + oxs[i]! * oscale;
  }
}

// This helps with type checking; it is implemented magically by Float32Array and Float64Array
export interface LocalArrayType {
  get length(): number;
  slice(): this;
  [index: number]: number;
  set(array: ArrayLike<number>): void;
}
