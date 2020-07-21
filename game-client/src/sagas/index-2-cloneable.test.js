import * as types from "../constants/ActionTypes";
import {
  put,
  takeEvery,
  all,
  call,
  select,
  selector,
  delay,
} from "redux-saga/effects";
import { apiGetAverageGuesses, apiWin } from "../api";
import {
  registerWin,
  registerWinStarted,
  registerWinCompleted,
  verifyGuessStarted,
  verifyGuessCompleted,
  restartGame,
  requestFailed,
  restartGameStarted,
  restartGameCompleted,
} from "../components/game/actions";

import {
  verifyGuessSaga,
  registerWinSaga,
  restartGameSaga,
  getWin,
  getOriginal,
} from "./index";

import { cloneableGenerator } from "@redux-saga/testing-utils";

describe("verifyGuessSaga() ", () => {
  const guess = 100;
  const action = { type: types.VERIFY_GUESS, payload: guess };
  const generator = cloneableGenerator(verifyGuessSaga)(action);
  it("calls verifyGuessStarted action", () => {
    expect(generator.next().value).toEqual(put(verifyGuessStarted()));
  });
  it("calls getOriginal select", () => {
    expect(generator.next().value).toEqual(select(getOriginal));
  });
  describe("and deviation !=== 0", () => {
    let clone;
    beforeAll(() => {
      clone = generator.clone();
    });
    it("calls verifyGuessCompleted", () => {
      const result = clone.next().value;
      expect(result).toEqual(put(verifyGuessCompleted()));
    });
    it("then completes", () => {
      const result = clone.next().done;
      expect(result).toBe(true);
    });
  });
  describe("and deviation === 0", () => {
    let clone;
    beforeAll(() => {
      clone = generator.clone();
    });
    it("calls getWin", () => {
      const result = clone.next(100).value;
      expect(result).toEqual(select(getWin));
    });
    it("calls registerWin", () => {
      const result = clone.next().value;
      expect(result).toEqual(put(registerWin()));
    });
    it("calls verifyGuessCompleted", () => {
      const result = clone.next().value;
      expect(result).toEqual(put(verifyGuessCompleted()));
    });
    it("then completes", () => {
      const result = clone.next().done;
      expect(result).toBe(true);
    });
  });
  describe("[Scenario] API call fails and throws an exception", () => {
    let clone;
    beforeAll(() => {
      clone = generator.clone();
    });
    it("then triggers an error action with the error message", () => {
      const error = new Error("404 Not Found");
      const result = clone.throw(error).value;
      expect(result).toEqual(put(requestFailed("Error: 404 Not Found")));
    });
    it("then completes", () => {
      const result = clone.next().done;
      expect(result).toBe(true);
    });
  });
});
