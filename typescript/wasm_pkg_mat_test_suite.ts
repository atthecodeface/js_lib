import * as wasm_pkg from "./wasm_pkg.js";

export class MatTestSuite extends wasm_pkg.TestSuite {
  test_mat_1(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test clone, determinant, set_identity, set_zero, set_add, is_zero, set_neg, for zero/identity matrics

    const m0 = new wasm_pkg.WasmMat3f32();
    const m1 = wasm_pkg.WasmMat3f32.identity();

    expect(m0.is_zero).toBe(true);
    expect(m0.determinant()).toBe(0);
    expect(m1.is_zero).toBe(false);
    expect(m1.determinant()).toBe(1);
    const m2 = m1.clone();
    m1.set_sub(m2);

    expect(m1.is_zero).toBe(true);
    expect(m1.determinant()).toBe(0);

    m1.set_identity();
    expect(m1.determinant()).toBe(1);
    m1.set_mulf(2);
    expect(m1.determinant()).toBe(8);
    m1.set_divf(4);
    expect(m1.determinant()).toBe(1 / 8);
    m1.set_neg();
    expect(m1.determinant()).toBe(-1 / 8);
    m1.set_add(m0);
    expect(m1.determinant()).toBe(-1 / 8);

    m2.set_array(m1.array);
    m1.set_add(m2);
    expect(m1.determinant()).toBe(-1);

    const a = m1.array;
    expect(a[0]).toBe(-1);
    expect(a[4]).toBe(-1);
    expect(a[8]).toBe(-1);
    a[0] = 0;
    a[4] = 0;
    a[8] = 0;
    m1.set_array(a);

    expect(m1.is_zero).toBe(true);
    return;
  }

  test_mat_2(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test clone, determinant, set_identity, set_zero, set_add, is_zero, set_sub, set_neg with non-zero entries

    const m0 = new wasm_pkg.WasmMat3f32();
    const m1 = wasm_pkg.WasmMat3f32.identity();
    m0.set_array(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    {
      const a = m0.array;
      expect(a[0]).toBe(1);
      expect(a[1]).toBe(2);
      expect(a[2]).toBe(3);
      expect(a[3]).toBe(4);
      expect(a[4]).toBe(5);
      expect(a[5]).toBe(6);
      expect(a[6]).toBe(7);
      expect(a[7]).toBe(8);
      expect(a[8]).toBe(9);
    }
    m1.set_add(m0);
    {
      const a = m1.array;
      expect(a[0]).toBe(2);
      expect(a[1]).toBe(2);
      expect(a[2]).toBe(3);
      expect(a[3]).toBe(4);
      expect(a[4]).toBe(6);
      expect(a[5]).toBe(6);
      expect(a[6]).toBe(7);
      expect(a[7]).toBe(8);
      expect(a[8]).toBe(10);
    }
    // determinant is 0 as the rows are linearly dependent
    expect(m0.determinant()).toBe(
      1 * (5 * 9 - 6 * 8) + 2 * (6 * 7 - 4 * 9) + 3 * (4 * 8 - 5 * 7),
    );
    // Non-zero
    expect(m1.determinant()).toBe(
      2 * (6 * 10 - 6 * 8) + 2 * (6 * 7 - 4 * 10) + 3 * (4 * 8 - 6 * 7),
    );

    m1.set_neg();
    {
      const a = m1.array;
      expect(a[0]).toBe(-2);
      expect(a[1]).toBe(-2);
      expect(a[2]).toBe(-3);
      expect(a[3]).toBe(-4);
      expect(a[4]).toBe(-6);
      expect(a[5]).toBe(-6);
      expect(a[6]).toBe(-7);
      expect(a[7]).toBe(-8);
      expect(a[8]).toBe(-10);
    }
    m1.set_sub(m0);
    {
      const a = m1.array;
      expect(a[0]).toBe(-3);
      expect(a[1]).toBe(-4);
      expect(a[2]).toBe(-6);
      expect(a[3]).toBe(-8);
      expect(a[4]).toBe(-11);
      expect(a[5]).toBe(-12);
      expect(a[6]).toBe(-14);
      expect(a[7]).toBe(-16);
      expect(a[8]).toBe(-19);
    }
  }
  test_mat_3(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test invert, transpose, set_tranpose, set_inverse
    const m0 = new wasm_pkg.WasmMat3f32();
    const id = wasm_pkg.WasmMat3f32.identity();
    m0.set_array(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));

    // m0 is not invertible
    const m1 = m0.clone();
    expect(m1.set_inverse(m0)).toBe(false);

    // m0 + id *is* invertible
    m0.set_add(id);
    expect(m1.set_inverse(m0)).toBe(true);

    m1.set_mul(m0);
    m1.set_sub(id);
    expect(m1.determinant()).toBeCloseTo(0, 4);

    m1.set_transpose(m0);
    expect(m1.determinant()).toBe(m0.determinant());

    m0.set_sub(id);
    expect(m0.determinant()).toBe(0);
    m1.set_transpose(m0);
    expect(m1.determinant()).toBe(0);
    const m2 = m1.clone();
    m2.set_array(m1.array);
    m2.transpose();
    m2.set_sub(m0);
    expect(m2.is_zero).toBe(true);

    m2.set_array(m0.array);
    m2.set_add(id);
    m2.transpose();
    m2.set_sub(m0);
    expect(m2.is_zero).toBe(false);
    expect(m2.determinant()).toBeCloseTo(25, 4);

    m1.set_array(m2.array);
    m2.invert();
    m1.set_mul(m2);
    m1.set_sub(id);
    expect(m1.determinant()).toBeCloseTo(0, 4);
  }

  test_mat_4(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_mulf, set_divf
    const m0 = new wasm_pkg.WasmMat3f32();
    const id = wasm_pkg.WasmMat3f32.identity();
    m0.set_array(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    m0.set_add(id);
    const m2 = m0.clone();
    m2.set_mulf(4);
    m2.set_sub(m0);
    expect(m2.determinant()).toBe(27 * m0.determinant());
    m2.set_sub(m0);
    expect(m2.determinant()).toBe(8 * m0.determinant());
    m2.set_divf(0.5);
    expect(m2.determinant()).toBe(64 * m0.determinant());
  }

  test_mat_5(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test mul_set_vec, mul_vec
    const m0 = new wasm_pkg.WasmMat3f32();
    const m1 = new wasm_pkg.WasmMat3f32();
    m0.set_array(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 10]));
    const v0 = new wasm_pkg.WasmVec3f32(6, 4, 2);
    const v1 = m0.mul_vec(v0);
    {
      const a = v1.array;
      expect(a[0]).toBe(20);
      expect(a[1]).toBe(56);
      expect(a[2]).toBe(94);
    }
    m1.set_inverse(m0);
    const v2 = m1.mul_vec(v1);
    {
      const a = v2.array;
      expect(a[0]).toBeCloseTo(6, 4);
      expect(a[1]).toBeCloseTo(4, 4);
      expect(a[2]).toBeCloseTo(2, 4);
    }
    v1.set_array(v0.array);
    m0.mul_set_vec(v1);
    expect(v1.distance_sq(v0)).toBeCloseTo(11364, 1);
    m1.mul_set_vec(v1);
    expect(v1.distance_sq(v0)).toBeCloseTo(0, 2);
  }
}
