/**
 * @jest-environment jsdom
 */

import indexedDB from "fake-indexeddb";
import * as storage from "./storage";
import { Log, Severity } from "./log";

// jsdom does not include structuredClone, which fake-indexeddb requires
if (!global.structuredClone) {
  global.structuredClone = function structuredClone(objectToClone: any) {
    const stringified = JSON.stringify(objectToClone);
    console.log("cloned to ", stringified);
    const parsed = JSON.parse(stringified);
    return parsed;
  };
}

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

test("DbStorage", async () => {
  jest.useFakeTimers();
  const results = {
    db_initialized: false,
    db_init_success: false,
  };

  const files = new storage.DBStorage(
    indexedDB,
    "test_db",
    (success) => {
      results.db_initialized = true;
      results.db_init_success = success;
    },
    new Log("", Severity.Fatal, Severity.Verbose),
  );
  while (!results.db_initialized) {
    await jest.runAllTimersAsync();
  }

  const success_log: Array<boolean> = [];
  const log_success = (success: boolean) => {
    success_log.push(success);
  };
  const wait_for_log = async (n: number) => {
    while (success_log.length < n) {
      await jest.runAllTimersAsync();
    }
  };

  files.request_get_file_list(log_success);
  await wait_for_log(1);
  files.request_save_file("first.txt", new Buffer("first text"), log_success);
  await wait_for_log(2);

  expect(success_log).toEqual([true, true]);

  expect(files.dir().files_of_type("txt").size).toBe(1);

  files.request_load_file("first.txt", (data) => {
    console.log(data);
    log_success(data == "first text");
  });
  await wait_for_log(3);
  files.request_load_file("first.txt", (data) => {
    log_success(data == "not first text");
  });
  await wait_for_log(4);

  expect(files.dir().files_of_type("txt").size).toBe(1);

  files.request_delete_file("first.txt", log_success);
  await wait_for_log(5);
  files.request_load_file("first.txt", (data) => {
    log_success(data == "first text");
  });
  await wait_for_log(6);
  // console.log(success_log);
  expect(success_log).toEqual([true, true, true, false, true, false]);
  expect(files.dir().files_of_type("txt").size).toBe(0);

  console.log(success_log);
  while (false && true) {
    await jest.runAllTimersAsync();
  }
}, 1000);
