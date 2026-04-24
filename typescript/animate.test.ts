/**
 * @jest-environment jsdom
 */

import * as animate from "./animate";

test("Simple schedule_at", () => {
  jest.useFakeTimers();
  const times: Array<number> = [];
  const anim = new animate.Animate((time) => {
    times.push(time);
    if (times.length < 10) {
      anim.schedule_at(time + 10);
    }
  });

  anim.restart(0);
  jest.runAllTimers();
  // console.log(times);
  expect(times.length).toBe(10);
  expect(times[1] - times[0]).toBe(10);
  expect(times[9] - times[0]).toBe(90);
});

test("Simple schedule_after", () => {
  jest.useFakeTimers();
  const times: Array<number> = [];
  const anim = new animate.Animate((time) => {
    times.push(time);
    if (times.length < 10) {
      anim.schedule(times.length);
    }
  });

  jest.runAllTimers();
  // Use a restart of 1 (as 0 is an animation frame, of unknown length in jest)
  anim.restart(1);
  jest.runAllTimers();
  // console.log(times);
  expect(times.length).toBe(10);
  expect(times[0]).toBe(1);
  expect(times[1] - times[0]).toBe(1);
  expect(times[9] - times[0]).toBe(45);
  expect(anim.duration()).toBe(46);

  anim.restart(50, (time) => {
    times.splice(0);
    times.push(0, 0, 0, 0, 0);
    anim.schedule(1);
  });
  jest.runAllTimers();

  // This is expecting to run for just delays of 6, 7, 8, 9, 10; with a restart delay of 1

  // console.log(times);
  expect(times[6] - times[5]).toBe(6);
  expect(times[9] - times[5]).toBe(30);
  expect(anim.duration()).toBe(31);
});

test("Simple schedule with stop", () => {
  jest.useFakeTimers();

  const times: Array<number> = [];
  const anim = new animate.Animate((time) => {
    times.push(time);
    anim.schedule(5);
  });
  const anim_stop = new animate.Animate((time) => {
    anim.stop();
  });

  anim.restart(10);
  anim_stop.restart(103);
  jest.runAllTimers();

  // anim should have run at 10, 15, ... 100; this is 19 times
  expect(times.length).toBe(19);
  expect(times[0]).toBe(10);
  expect(times[18]).toBe(100);
  // anim started at time 0 with delay of 10, last animation call at 100;
  // anim_stop started at time 0 with delay of 103, last animation call at 103;
  expect(anim.duration()).toBe(100);
  expect(anim_stop.duration()).toBe(103);
});
