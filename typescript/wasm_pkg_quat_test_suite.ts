import * as wasm_pkg from "./wasm_pkg.js";

export class QuatTestSuite extends wasm_pkg.TestSuite {
  test_quat_1(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test new, unit, clone, r, i, j, k, length_sq, length, set, set_unit
    const q0 = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);

    expect(q0.r).toBe(4);
    expect(q0.i).toBe(1);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);

    q0.r = 7;
    expect(q0.r).toBe(7);
    expect(q0.i).toBe(1);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);

    q0.i = 4;
    expect(q0.r).toBe(7);
    expect(q0.i).toBe(4);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);

    q0.j = 5;
    expect(q0.r).toBe(7);
    expect(q0.i).toBe(4);
    expect(q0.j).toBe(5);
    expect(q0.k).toBe(3);

    q0.k = 1;
    expect(q0.r).toBe(7);
    expect(q0.i).toBe(4);
    expect(q0.j).toBe(5);
    expect(q0.k).toBe(1);

    const q1 = q0.clone();
    expect(q1.r).toBe(7);
    expect(q1.i).toBe(4);
    expect(q1.j).toBe(5);
    expect(q1.k).toBe(1);
    expect(q1 instanceof wasm_pkg.WasmQuatf32).toBe(true);

    q0.set_unit();
    expect(q0.r).toBe(1);
    expect(q0.i).toBe(0);
    expect(q0.j).toBe(0);
    expect(q0.k).toBe(0);
    expect(q1.r).toBe(7);
    expect(q1.i).toBe(4);
    expect(q1.j).toBe(5);
    expect(q1.k).toBe(1);

    q1.set(3, 4, 12, 84);
    expect(q1.r).toBe(84);
    expect(q1.i).toBe(3);
    expect(q1.j).toBe(4);
    expect(q1.k).toBe(12);
    expect(q1.length_sq).toBe(85 * 85);
    expect(q1.length).toBe(85);
  }

  test_quat_2(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_add/sub/mulf/divf
    const q = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);
    const q_i = new wasm_pkg.WasmQuatf32(1, 0, 0, 0);
    const q_j = new wasm_pkg.WasmQuatf32(0, 1, 0, 0);
    const q_k = new wasm_pkg.WasmQuatf32(0, 0, 1, 0);
    const q_r = new wasm_pkg.WasmQuatf32(0, 0, 0, 1);
    const q0 = q.clone();
    q0.set_add(q_i);
    q0.set_add(q_j);
    q0.set_add(q_j);
    q0.set_add(q_k);
    q0.set_add(q_k);
    q0.set_add(q_k);
    q0.set_add(q_r);
    q0.set_add(q_r);
    q0.set_add(q_r);
    q0.set_add(q_r);

    expect(q0.r).toBe(8);
    expect(q0.i).toBe(2);
    expect(q0.j).toBe(4);
    expect(q0.k).toBe(6);

    q0.set_divf(2);
    expect(q0.r).toBe(4);
    expect(q0.i).toBe(1);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);

    q0.set_mulf(2);
    expect(q0.r).toBe(8);
    expect(q0.i).toBe(2);
    expect(q0.j).toBe(4);
    expect(q0.k).toBe(6);

    q0.set_sub(q_i);
    q0.set_sub(q_j);
    q0.set_sub(q_j);
    q0.set_sub(q_k);
    q0.set_sub(q_k);
    q0.set_sub(q_k);
    q0.set_sub(q_r);
    q0.set_sub(q_r);
    q0.set_sub(q_r);
    q0.set_sub(q_r);
    expect(q0.r).toBe(4);
    expect(q0.i).toBe(1);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);
  }

  test_quat_3(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_neg, set_normalized, set_conjugate
    const q0 = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);
    q0.set_neg();
    expect(q0.r).toBe(-4);
    expect(q0.i).toBe(-1);
    expect(q0.j).toBe(-2);
    expect(q0.k).toBe(-3);

    q0.set_conjugate();
    expect(q0.r).toBe(-4);
    expect(q0.i).toBe(1);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);

    q0.set_neg();
    expect(q0.r).toBe(4);
    expect(q0.i).toBe(-1);
    expect(q0.j).toBe(-2);
    expect(q0.k).toBe(-3);

    const l_sq = q0.length_sq;
    const q1 = q0.clone();
    q1.set_normalized();
    expect(q1.length_sq).toBeCloseTo(1, 6);
    const q2 = q1.clone();
    q2.set_mulf(Math.sqrt(l_sq));
    q2.set_sub(q0);
    expect(q2.length).toBeCloseTo(0, 6);
  }

  test_quat_4(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_mul/div/premul/prediv
    const q = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);
    const q_i = new wasm_pkg.WasmQuatf32(1, 0, 0, 0);
    const q_j = new wasm_pkg.WasmQuatf32(0, 1, 0, 0);
    const q_k = new wasm_pkg.WasmQuatf32(0, 0, 1, 0);
    const q_r = new wasm_pkg.WasmQuatf32(0, 0, 0, 1);

    const q0 = q.clone();
    q0.set_mul(q_r);
    expect(q0.r).toBe(4);
    expect(q0.i).toBe(1);
    expect(q0.j).toBe(2);
    expect(q0.k).toBe(3);

    // q0 = q0 * q_i
    q0.set_mul(q_i);
    expect(q0.r).toBe(-1);
    expect(q0.i).toBe(4);
    expect(q0.j).toBe(3);
    expect(q0.k).toBe(-2);

    // q0 = q0 * q_j
    q0.set_mul(q_j);
    expect(q0.r).toBe(-3);
    expect(q0.i).toBe(2);
    expect(q0.j).toBe(-1);
    expect(q0.k).toBe(4);

    // q0 = q0 * q_k
    q0.set_mul(q_k);
    expect(q0.r).toBe(-4);
    expect(q0.i).toBe(-1);
    expect(q0.j).toBe(-2);
    expect(q0.k).toBe(-3);

    // q0 = q0 * q_i'
    q0.set_div(q_i);
    expect(q0.r).toBe(-1);
    expect(q0.i).toBe(4);
    expect(q0.j).toBe(3);
    expect(q0.k).toBe(-2);

    // q0 = q0 * q_j'
    q0.set_div(q_j);
    expect(q0.r).toBe(3);
    expect(q0.i).toBe(-2);
    expect(q0.j).toBe(1);
    expect(q0.k).toBe(-4);

    // q0 = q0 * q_k'
    q0.set_div(q_k);
    expect(q0.r).toBe(-4);
    expect(q0.i).toBe(-1);
    expect(q0.j).toBe(-2);
    expect(q0.k).toBe(-3);

    const q1 = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);
    q1.set_normalized();
    const q2 = new wasm_pkg.WasmQuatf32(7, 5, 3, 1);
    q2.set_normalized();
    {
      const qa = q1.clone();
      const qb = q2.clone();
      qa.set_premul(q2);
      qb.set_mul(q1);
      expect(qa.distance_sq(qb)).toBeCloseTo(0, 6);
    }

    {
      const qa = q1.clone();
      const qb = q2.clone();
      qa.set_prediv(q2);
      qb.set_div(q1);
      expect(qa.distance_sq(qb)).toBeCloseTo(0, 6);
    }
    {
      const qa = q1.clone();
      qa.set_mul(q2);
      qa.set_div(q2);
      expect(qa.distance_sq(q1)).toBeCloseTo(0, 6);
    }
    {
      const qa = q1.clone();
      qa.set_mul(q2);
      qa.set_prediv(q2);
      qa.set_conjugate();
      expect(qa.distance_sq(q1)).toBeCloseTo(0, 6);
    }
  }

  test_quat_5(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test dpt/distance_sq/distance
    const q0 = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);
    const q1 = new wasm_pkg.WasmQuatf32(7, 5, 3, 1);

    expect(q0.dot(q1)).toBe(7 * 1 + 2 * 5 + 3 * 3 + 4 * 1);

    q0.set_normalized();
    q1.set_normalized();
    {
      const q = q0.clone();
      q.set_div(q1);
      const dsq = 1 - Math.abs(q.r);
      const d = Math.sqrt(dsq);
      expect(dsq).toBeCloseTo(q0.distance_sq(q1), 6);
      expect(d).toBeCloseTo(q0.distance(q1), 6);
    }
  }

  test_quat_6(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test   set_mul_rotate_x/y/z
    const q = wasm_pkg.WasmQuatf32.unit();
    const pi = 3.1415926538;
    const frac_pi_2 = 3.1415926538 / 2;

    const q_x_180 = wasm_pkg.WasmQuatf32.unit();
    q_x_180.set_mul_rotate_x(pi);
    const q_y_180 = wasm_pkg.WasmQuatf32.unit();
    q_y_180.set_mul_rotate_y(pi);
    const q_z_180 = wasm_pkg.WasmQuatf32.unit();
    q_z_180.set_mul_rotate_z(pi);

    expect(q.distance(q)).toBeCloseTo(0, 6);
    expect(q.distance(q_x_180)).toBeCloseTo(1, 6);
    expect(q.distance(q_y_180)).toBeCloseTo(1, 6);
    expect(q.distance(q_z_180)).toBeCloseTo(1, 6);

    expect(q_x_180.distance(q)).toBeCloseTo(1, 6);
    expect(q_x_180.distance(q_x_180)).toBeCloseTo(0, 6);
    expect(q_x_180.distance(q_y_180)).toBeCloseTo(1, 6);
    expect(q_x_180.distance(q_z_180)).toBeCloseTo(1, 6);

    const q_x_90 = wasm_pkg.WasmQuatf32.unit();
    q_x_90.set_mul_rotate_x(frac_pi_2);
    const q_y_90 = wasm_pkg.WasmQuatf32.unit();
    q_y_90.set_mul_rotate_y(frac_pi_2);
    const q_z_90 = wasm_pkg.WasmQuatf32.unit();
    q_z_90.set_mul_rotate_z(frac_pi_2);

    expect(q_x_90.length_sq).toBeCloseTo(1, 6);
    expect(q_x_90.j).toBeCloseTo(0, 6);
    expect(q_x_90.k).toBeCloseTo(0, 6);
    expect(q_y_90.length_sq).toBeCloseTo(1, 6);
    expect(q_y_90.i).toBeCloseTo(0, 6);
    expect(q_y_90.k).toBeCloseTo(0, 6);
    expect(q_z_90.length_sq).toBeCloseTo(1, 6);
    expect(q_z_90.i).toBeCloseTo(0, 6);
    expect(q_z_90.j).toBeCloseTo(0, 6);

    expect(q.distance_sq(q)).toBeCloseTo(0, 6);
    expect(q.distance_sq(q_x_90)).toBeCloseTo(1 - 0.707107, 5);
    expect(q.distance_sq(q_y_90)).toBeCloseTo(1 - 0.707107, 5);
    expect(q.distance_sq(q_z_90)).toBeCloseTo(1 - 0.707107, 5);

    expect(q_x_90.distance_sq(q_z_90)).toBeCloseTo(0.5, 5);
    expect(q_y_90.distance_sq(q_z_90)).toBeCloseTo(0.5, 5);
    expect(q_x_90.distance_sq(q_y_90)).toBeCloseTo(0.5, 5);

    {
      const q = q_x_90.clone();
      q.set_mul(q.clone());
      expect(q_x_180.distance_sq(q)).toBeCloseTo(0, 5);
    }
    {
      const q = q_y_90.clone();
      q.set_mul(q.clone());
      expect(q_y_180.distance_sq(q)).toBeCloseTo(0, 5);
    }
    {
      const q = q_z_90.clone();
      q.set_mul(q.clone());
      expect(q_z_180.distance_sq(q)).toBeCloseTo(0, 5);
    }

    const q0 = new wasm_pkg.WasmQuatf32(1, 2, 3, 4);
    q0.set_normalized();
    const q1 = new wasm_pkg.WasmQuatf32(7, 5, 3, 1);
    q1.set_normalized();

    {
      // q0_c = q0 * rotate_x(90)
      const q0_0 = q0.clone();
      const q0_1 = q0.clone();
      q0_0.set_mul(q_x_90);
      q0_1.set_mul_rotate_x(frac_pi_2);
      // console.log(q0_0.rijk);
      expect(q0_0.distance_sq(q0_1)).toBeCloseTo(0, 6);
    }

    {
      // q0_c = rotate_y(90) * q0_c
      const q0_0 = q0.clone();
      const q0_1 = q0.clone();
      q0_0.set_premul(q_y_90);
      q0_1.set_premul_rotate_y(frac_pi_2);
      expect(q0_0.distance_sq(q0_1)).toBeCloseTo(0, 6);
    }
    {
      // q0_c = rotate_y(90) * q0_c
      const q0_0 = q0.clone();
      const q0_1 = q0.clone();
      q0_0.set_premul(q_z_90);
      q0_1.set_premul_rotate_z(frac_pi_2);
      // console.log(q0_0.rijk);
      expect(q0_0.distance_sq(q0_1)).toBeCloseTo(0, 6);
    }
  }

  test_quat_7(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_of_axis_angle, apply_vec
    const pi = 3.1415926538;
    const frac_pi_2 = 3.1415926538 / 2;

    const x_axis = new wasm_pkg.WasmVec3f32(1, 0, 0);
    const x_axis_x2 = x_axis.clone();
    x_axis_x2.set_mulf(2);
    const q_x_90_a = wasm_pkg.WasmQuatf32.unit();
    const q_x_90_b = wasm_pkg.WasmQuatf32.unit();
    q_x_90_a.set_of_axis_angle(x_axis_x2, frac_pi_2);
    q_x_90_b.set_mul_rotate_x(frac_pi_2);
    expect(q_x_90_a.distance_sq(q_x_90_b)).toBeCloseTo(0, 6);

    // Rotate (1,0,0) to (0,1,0) to (0,0,1) and back again
    const ooo = new wasm_pkg.WasmVec3f32(1, 1, 1);
    const q_rot_ooo_120 = wasm_pkg.WasmQuatf32.unit();
    q_rot_ooo_120.set_of_axis_angle(ooo, (2 * pi) / 3);

    expect(q_rot_ooo_120.r).toBeCloseTo(0.5, 6);
    expect(q_rot_ooo_120.i).toBeCloseTo(0.5, 6);
    expect(q_rot_ooo_120.j).toBeCloseTo(0.5, 6);
    expect(q_rot_ooo_120.k).toBeCloseTo(0.5, 6);

    /*
    console.log(
      q_rot_ooo_120.apply_vec(x_axis),
      q_rot_ooo_120.apply_vec(q_rot_ooo_120.apply_vec(x_axis)),
      x_axis,
    );
   */
    expect(q_rot_ooo_120.apply_vec(ooo).distance_sq(ooo)).toBeCloseTo(0, 6);
    expect(q_rot_ooo_120.apply_vec(x_axis).distance_sq(x_axis)).toBeCloseTo(
      2,
      6,
    );
    expect(
      q_rot_ooo_120
        .apply_vec(q_rot_ooo_120.apply_vec(x_axis))
        .distance_sq(x_axis),
    ).toBeCloseTo(2, 6);
    // Three rotations is back to where we started
    expect(
      q_rot_ooo_120
        .apply_vec(q_rot_ooo_120.apply_vec(q_rot_ooo_120.apply_vec(x_axis)))
        .distance_sq(x_axis),
    ).toBeCloseTo(0, 6);
  }
  test_quat_8(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_of_rotation_of_vec_to_vec
    let last_v = null;
    for (const [x, y, z] of [
      [1, 0, 0],
      [1, 1, 0],
      [-1, 2, 3],
      [3, 4, 5],
      [-1, -2, -3],
    ]) {
      const v = new wasm_pkg.WasmVec3f32(x!, y!, z!);
      v.set_normalized();
      if (last_v !== null) {
        const q = wasm_pkg.WasmQuatf32.unit();
        q.set_rotation_of_vec_to_vec(v, last_v);
        const qc = q.clone();
        qc.set_conjugate();
        const tv = v.clone();
        q.apply_set_vec(tv);
        expect(tv.distance_sq(last_v)).toBeCloseTo(0, 6);
        qc.apply_set_vec(tv);
        expect(tv.distance_sq(v)).toBeCloseTo(0, 6);
      }

      last_v = v;
    }
  }
  test_quat_9(expect: (e: any) => wasm_pkg.TestExpectation): void {
    // test set_mapping_vector_pair_to_vector_pair
    for (const [r, i, j, k] of [
      [1, 0, 0, 0],
      [3, 1, 0, 0],
      [2, 1, 1, 0],
      [1, -1, 2, 3],
      [3, 3, 4, 5],
      [4, -1, -2, -3],
    ]) {
      const q = new wasm_pkg.WasmQuatf32(i!, j!, k!, r!);
      q.set_normalized();
      let last_v = null;
      for (const [x, y, z] of [
        [1, 0, 0],
        [1, 1, 0],
        [-1, 2, 3],
        [3, 4, 5],
        [-1, -2, -3],
      ]) {
        const v = new wasm_pkg.WasmVec3f32(x!, y!, z!);
        v.set_normalized();
        if (last_v !== null) {
          const vm = v.clone();
          const last_vm = last_v.clone();
          q.apply_set_vec(vm);
          q.apply_set_vec(last_vm);

          const tq = wasm_pkg.WasmQuatf32.unit();
          tq.set_mapping_vector_pair_to_vector_pair(v, last_v, vm, last_vm);
          expect(tq.distance_sq(q)).toBeCloseTo(0, 6);
        }
        last_v = v;
      }
    }
  }
}
