/**
 * @jest-environment jsdom
 */

import * as html from "./html";
import * as tabs from "./tabs";

declare global {
  var last_selected: string;
  var last_selected_number: number;
}
global.last_selected = "";
global.last_selected_number = 0;

test("Basic", () => {
  const body = new html.HtmlElement(
    document.children[0]!.children[0]! as HTMLElement,
  );
  const div_tabs = body.add_ele("div", { id: "div-tabs" });

  const div_one = body.add_ele("div", { id: "one" });
  const div_two = body.add_ele("div", { id: "two" });
  const div_three = body.add_ele("div", { id: "three" });

  const doc_tabs = new tabs.Tabs(
    "div-tabs",
    (num, name) => {
      global.last_selected = name;
      global.last_selected_number = num;
    },
    [
      ["one", "One", 1],
      ["two", "Two", 2],
      ["three", "Three", 3],
    ],
  );

  expect(doc_tabs.select("one")).toBe("one");
  expect(global.last_selected).toBe("one");
  expect(global.last_selected_number).toBe(1);
  expect(doc_tabs.select("one")).toBe("one");
  expect(global.last_selected).toBe("one");
  global.last_selected = "no callback invoked";
  expect(doc_tabs.select("one")).toBe("one");
  expect(global.last_selected).toBe("no callback invoked");

  expect(doc_tabs.select("two")).toBe("two");
  expect(global.last_selected).toBe("two");
  expect(doc_tabs.select("three")).toBe("three");
  expect(global.last_selected).toBe("three");
  expect(doc_tabs.select("UNKNOWN")).toBe("one"); // Selects first declared tab on unknown name
  expect(global.last_selected).toBe("one");

  expect(
    document
      .defaultView!.getComputedStyle(div_one.ele, null)
      .getPropertyValue("display"),
  ).toBe("block");
  expect(
    document
      .defaultView!.getComputedStyle(div_two.ele, null)
      .getPropertyValue("display"),
  ).toBe("none");
  expect(
    document
      .defaultView!.getComputedStyle(div_three.ele, null)
      .getPropertyValue("display"),
  ).toBe("none");
});
