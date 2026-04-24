/**
 * @jest-environment jsdom
 */

import { log } from "console";
import * as storage from "./storage";

test("Directory", () => {
  const files = new storage.Directory();
  expect(files.files_of_type("txt").size).toBe(0);
  expect(files.files_of_type("bread").size).toBe(0);

  expect(files.add_file("fred", "txt")).toBe(true);
  expect(files.files_of_type("txt").size).toBe(1);
  expect(files.files_of_type("bread").size).toBe(0);

  expect(files.add_file("fred", "txt")).toBe(false);
  expect(files.files_of_type("txt").size).toBe(1);
  expect(files.files_of_type("bread").size).toBe(0);

  files.add_file("joe.txt");
  expect(files.files_of_type("txt").size).toBe(2);
  expect(files.files_of_type("bread").size).toBe(0);

  expect(files.delete_file("joe.txt")).toBe(true);
  expect(files.files_of_type("txt").size).toBe(1);
  expect(files.files_of_type("bread").size).toBe(0);

  expect(files.delete_file("joe.txt")).toBe(false);
  expect(files.files_of_type("txt").size).toBe(1);
  expect(files.files_of_type("bread").size).toBe(0);

  files.delete_file("fred.txt");
  expect(files.files_of_type("txt").size).toBe(0);
  expect(files.files_of_type("bread").size).toBe(0);
});

test("LocalStorage", () => {
  const files = new storage.LocalStorage(localStorage, "test");
  const success_log: Array<boolean> = [];
  const log_success = (success: boolean) => {
    success_log.push(success);
  };
  files.request_get_file_list(log_success);
  files.request_save_file("first.txt", "first text", log_success);
  expect(success_log).toEqual([true, true]);
  files.request_load_file("first.txt", (data) => {
    log_success(data == "first text");
  });
  files.request_load_file("first.txt", (data) => {
    log_success(data == "not first text");
  });

  expect(files.dir().files_of_type("txt").size).toBe(1);

  files.request_delete_file("first.txt", log_success);
  files.request_load_file("first.txt", (data) => {
    log_success(data == "first text");
  });
  expect(success_log).toEqual([true, true, true, false, true, false]);
  expect(files.dir().files_of_type("txt").size).toBe(0);
});
