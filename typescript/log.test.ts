/**
 * @jest-environment jsdom
 */

import * as html from "./html";
import * as log from "./log";

test("Severity levels", () => {
  expect(log.Severity.Verbose < log.Severity.Info).toBe(true);
  expect(log.Severity.Verbose < log.Severity.Warning).toBe(true);
  expect(log.Severity.Verbose < log.Severity.Error).toBe(true);
  expect(log.Severity.Verbose < log.Severity.Fatal).toBe(true);
});

test("Log creation", () => {
  const l = new log.Log(undefined, log.Severity.Error, log.Severity.Info);
  const console_logs: Array<string> = [];
  jest.spyOn(console, "log").mockImplementation((a) => console_logs.push(a));

  const logger = new log.Logger(l, "src1");
  logger.push_reason("Far too high a level");
  logger.push_reason("the level");
  logger.verbose("Verbose");
  expect(l.is_empty()).toBe(true);
  logger.info("Info");
  expect(l.is_empty()).toBe(true);
  logger.warning("Warning");
  expect(l.is_empty()).toBe(true);
  logger.error("Error");
  expect(l.is_empty()).toBe(false);
  logger.fatal("Fatal");
  expect(l.is_empty()).toBe(false);
  l.request_fill_div();

  expect(console_logs).toEqual([
    "Log: Info : src1 : the level : Info",
    "Log: Warning : src1 : the level : Warning",
    "Log: Error : src1 : the level : Error",
    "Log: Fatal : src1 : the level : Fatal",
  ]);
});

test("Log output", () => {
  jest.useFakeTimers();
  const h = html.HtmlElement.new_ele("div");
  expect(h.ele.children.length).toBe(0);

  const l = new log.Log(h, log.Severity.Error, log.Severity.Fatal);
  const logger = new log.Logger(l, "src1");
  logger.error("One error");
  jest.runAllTimers();
  expect(h.ele.children.length).toBe(1); // Should just be a table
  expect(h.ele.children[0].children.length).toBe(1); // Table should have one row
  expect(h.ele.children[0].children[0].children.length).toBe(4); // Table row should have four td

  logger.info("One info");
  jest.runAllTimers();
  expect(h.ele.children.length).toBe(1); // Should just be a table
  expect(h.ele.children[0].children.length).toBe(1); // Table should have one row
  expect(h.ele.children[0].children[0].children.length).toBe(4); // Table row should have four td

  logger.fatal("One Fatal");
  jest.runAllTimers();
  expect(h.ele.children.length).toBe(1); // Should just be a table
  expect(h.ele.children[0].children.length).toBe(2); // Table should have two rows
  expect(h.ele.children[0].children[1].children.length).toBe(4); // Table row should have four td
});
