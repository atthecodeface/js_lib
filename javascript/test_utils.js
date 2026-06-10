"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_zero = is_zero;
exports.dot = dot;
exports.cross_product = cross_product;
exports.set_scale_add_scaled = set_scale_add_scaled;
function is_zero(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] != 0) {
            return false;
        }
    }
    return true;
}
function dot(xs, oxs) {
    var r = 0.0;
    for (var i = 0; i < xs.length; i++) {
        r += xs[i] * oxs[i];
    }
    return r;
}
function cross_product(xs, oxs) {
    const i0 = xs[0];
    const j0 = xs[1];
    const k0 = xs[2];
    const i1 = oxs[0];
    const j1 = oxs[1];
    const k1 = oxs[2];
    return [j0 * k1 - k0 * j1, k0 * i1 - i0 * k1, i0 * j1 - j0 * i1];
}
function set_scale_add_scaled(xs, scale, oxs, oscale) {
    for (var i = 0; i < xs.length; i++) {
        xs[i] = xs[i] * scale + oxs[i] * oscale;
    }
}
//# sourceMappingURL=test_utils.js.map