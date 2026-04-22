/**
 * @jest-environment jsdom
 */

import * as html from "./html";
import * as tabbed from "./tabbed";

declare global {
  var last_selected: string;
}
global.last_selected = "";

test("Basic", () => {
  const body = new html.HtmlElement(
    document.children[0]!.children[0]! as HTMLElement,
  );
  const div_tabs = body.add_ele("div", { id: "div-tabs" });
  const ul = div_tabs.add_ele("ul", { id: "ul-tabs" });
  ul.add_ele("li").add_ele("a", { tag_values: [["href", "#one"]] });
  ul.add_ele("li").add_ele("a", { tag_values: [["href", "#two"]] });
  ul.add_ele("li").add_ele("a", { tag_values: [["href", "#three"]] });

  const div_one = body.add_ele("div", { id: "one" });
  const div_two = body.add_ele("div", { id: "two" });
  const div_three = body.add_ele("div", { id: "three" });

  const tabs = new tabbed.Tabs("#div-tabs", (hash) => {
    global.last_selected = hash;
  });

  expect(tabs.select_hash("#one")).toBe(0);
  expect(global.last_selected).toBe("#one");
  expect(tabs.select_hash("#one")).toBe(0);
  expect(global.last_selected).toBe("#one");
  global.last_selected = "no callback invoked";
  expect(tabs.select_hash("#one")).toBe(0);
  expect(global.last_selected).toBe("no callback invoked");

  expect(tabs.select_hash("#two")).toBe(1);
  expect(global.last_selected).toBe("#two");
  expect(tabs.select_hash("#three")).toBe(2);
  expect(global.last_selected).toBe("#three");
  expect(tabs.select_hash("UNKNOWN")).toBe(null);
  expect(global.last_selected).toBe("#three");

  expect(
    document
      .defaultView!.getComputedStyle(div_one.ele, null)
      .getPropertyValue("display"),
  ).toBe("none");
  expect(
    document
      .defaultView!.getComputedStyle(div_two.ele, null)
      .getPropertyValue("display"),
  ).toBe("none");
  expect(
    document
      .defaultView!.getComputedStyle(div_three.ele, null)
      .getPropertyValue("display"),
  ).toBe("block");
});
