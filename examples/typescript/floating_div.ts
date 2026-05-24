import { Tabs } from "./tabs.js";
import * as html from "./html.js";

enum SelectedTab {
  FixedOne,
  FixedTwo,
  FloatingSvg,
  FloatingText,
}

export class Main {
  tabs: Tabs<SelectedTab>;
  selected_tab: SelectedTab = SelectedTab.FixedOne;

  tab_list: [string, string, SelectedTab][] = [
    ["tab-fixed-one", "Fixed one", SelectedTab.FixedOne],
    ["tab-fixed-two", "Fixed two", SelectedTab.FixedTwo],
    ["tab-floating-svg", "SVG", SelectedTab.FloatingSvg],
    ["tab-floating-text", "Floating text", SelectedTab.FloatingText],
  ];

  resize_observer: ResizeObserver;

  constructor() {
    this.tabs = new Tabs(
      "tab-list",
      this.tab_selected.bind(this),
      this.tab_list,
    );

    this.resize_observer = new ResizeObserver(this.resize_event.bind(this));

    for (const resizable_content of document.getElementsByClassName(
      "get_size_of_this",
    )) {
      this.resize_observer.observe(resizable_content);
    }
  }

  resize_event(e: ResizeObserverEntry[]): void {
    console.log("Resize event", e);
    const resizable_box = document.getElementsByClassName(
      "get_size_of_this",
    )![0]! as HTMLDivElement;
    const svg = document.getElementsByClassName(
      "set_size_of_this",
    )![0]! as HTMLDivElement;
    const width = resizable_box.offsetWidth;
    const height = resizable_box.offsetWidth;
    const size = Math.max(Math.min(width, height) + 100, 20);
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
  }

  tab_selected(tab: SelectedTab, _tab_id: string) {
    this.selected_tab = tab;
    const e = new html.HtmlElement(
      document.getElementsByClassName("floating-div")![0]! as HTMLElement,
    );
    switch (this.selected_tab) {
      case SelectedTab.FixedOne:
      case SelectedTab.FixedTwo: {
        e.set_style("display", "none");
        break;
      }
      case SelectedTab.FloatingSvg: {
        e.set_style("display", "");
        new html.HtmlElement(
          document.getElementById("floating-svg")!,
        ).set_style("display", "");
        new html.HtmlElement(
          document.getElementById("floating-text")!,
        ).set_style("display", "none");
        break;
      }
      case SelectedTab.FloatingText: {
        e.set_style("display", "");
        new html.HtmlElement(
          document.getElementById("floating-svg")!,
        ).set_style("display", "none");
        new html.HtmlElement(
          document.getElementById("floating-text")!,
        ).set_style("display", "");
        break;
      }
    }
  }
}

window.addEventListener("load", (_e) => {
  (window as any).main = new Main();
});
