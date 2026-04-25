"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mouse_js_1 = require("../typescript/mouse.js");
const log = __importStar(require("../typescript/log.js"));
const html = __importStar(require("../typescript/html.js"));
class Main {
    constructor() {
        this.log = new log.Log();
        this.log_src = new log.Logger(this.log, "main");
        this.div = new html.HtmlElement(document.getElementById("DrawCanvas"));
        this.canvas = this.div.add_ele("canvas");
        const canvas = this.canvas.ele;
        canvas.width = 600;
        canvas.height = 400;
        const ctxt = canvas.getContext("2d");
        ctxt.fillStyle = "#FFA";
        ctxt.fillRect(0, 0, canvas.width, canvas.height);
        this.mouse = new mouse_js_1.Mouse(this, canvas);
    }
    user_zoom(xy, factor) {
        this.log_src.info(`Zoom ${xy} ${factor}`);
    }
    user_rotate(xy, angle) {
        this.log_src.info(`Rotate ${xy} ${angle}`);
    }
    user_pan(xy, dxy) {
        this.log_src.info(`Pan ${xy} ${dxy}`);
    }
    user_press(xy) {
        this.log_src.info(`Press ${xy}`);
        return 0;
    }
    user_press_move(start_xy, xy) {
        this.log_src.info(`Press move ${start_xy} ${xy}`);
    }
    user_press_cancel(start_xy) {
        this.log_src.info(`Press cancel ${start_xy}`);
    }
    user_release(start_xy, xy) {
        this.log_src.info(`Press release ${start_xy} ${xy}`);
    }
    drag_start(start_xy, xy) {
        this.log_src.info(`Drag start ${start_xy} ${xy}`);
    }
    drag_to(start_xy, old_xy, new_xy) {
        this.log_src.info(`Drag ${start_xy} ${old_xy} ${new_xy}`);
    }
    // Drag (which started at start_xy) has finished at xy (which the last drag_to probably indicated)
    drag_end(start_xy, xy) {
        this.log_src.info(`Drag end ${start_xy} ${xy}`);
    }
}
window.main = null;
function complete_init() {
    window.main = new Main();
}
window.addEventListener("load", (_e) => {
    complete_init();
});
