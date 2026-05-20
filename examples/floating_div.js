import { Tabs } from "./tabbed.js";
import * as html from "./html.js";
var SelectedTab;
(function (SelectedTab) {
    SelectedTab[SelectedTab["FixedOne"] = 0] = "FixedOne";
    SelectedTab[SelectedTab["FixedTwo"] = 1] = "FixedTwo";
    SelectedTab[SelectedTab["FloatingSvg"] = 2] = "FloatingSvg";
    SelectedTab[SelectedTab["FloatingText"] = 3] = "FloatingText";
})(SelectedTab || (SelectedTab = {}));
export class Main {
    constructor() {
        this.selected_tab = SelectedTab.FixedOne;
        this.tab_ids = new Map([
            [SelectedTab.FixedOne, "#tab-fixed-one"],
            [SelectedTab.FixedTwo, "#tab-fixed-two"],
            [SelectedTab.FloatingSvg, "#tab-floating-svg"],
            [SelectedTab.FloatingText, "#tab-floating-text"],
        ]);
        this.tabs = new Tabs("#tab-list", (id) => {
            this.tab_selected(id);
        });
        this.resize_observer = new ResizeObserver(this.resize_event.bind(this));
        for (const resizable_content of document.getElementsByClassName("get_size_of_this")) {
            this.resize_observer.observe(resizable_content);
        }
    }
    resize_event(e) {
        console.log("Resize event", e);
        const resizable_box = document.getElementsByClassName("get_size_of_this")[0];
        const svg = document.getElementsByClassName("set_size_of_this")[0];
        const width = resizable_box.offsetWidth;
        const height = resizable_box.offsetWidth;
        const size = Math.max(Math.min(width, height) + 100, 20);
        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
    }
    tab_selected(tab_id) {
        this.selected_tab = SelectedTab.FixedOne;
        for (const x of this.tab_ids) {
            if (x[1] === tab_id) {
                this.selected_tab = x[0];
            }
        }
        const e = new html.HtmlElement(document.getElementsByClassName("floating-div")[0]);
        switch (this.selected_tab) {
            case SelectedTab.FixedOne:
            case SelectedTab.FixedTwo: {
                e.set_style("display", "none");
                break;
            }
            case SelectedTab.FloatingSvg: {
                e.set_style("display", "");
                new html.HtmlElement(document.getElementById("floating-svg")).set_style("display", "");
                new html.HtmlElement(document.getElementById("floating-text")).set_style("display", "none");
                break;
            }
            case SelectedTab.FloatingText: {
                e.set_style("display", "");
                new html.HtmlElement(document.getElementById("floating-svg")).set_style("display", "none");
                new html.HtmlElement(document.getElementById("floating-text")).set_style("display", "");
                break;
            }
        }
    }
}
window.addEventListener("load", (_e) => {
    window.main = new Main();
});
