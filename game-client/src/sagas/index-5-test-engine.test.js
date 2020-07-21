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
import { apiGetAverageGuesses, apiWin, apiRestartGame } from "../api";
import {
  registerWin,
  registerWinStarted,
  registerWinCompleted,
  verifyGuess,
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

import { createSagaTestEngine } from "redux-saga-test-engine";

describe("restartGameSaga with successful api request ", () => {
  const collectEffects = createSagaTestEngine(["PUT", "CALL"]);
  const effects = collectEffects(
    restartGameSaga,
    [[call(apiRestartGame), { mockData: "mock" }]],
    restartGame
  );

  it("first calls restartGameStarted ", () => {
    expect(effects[0]).toEqual(put(restartGameStarted()));
  });

  it("then calls apiRestartGame", () => {
    expect(effects[1]).toEqual(call(apiRestartGame));
  });

  it("pauses ... ", () => {
    expect(effects[2]).toEqual(delay(1000));
  });

  it("then calls apiRestartGame", () => {
    expect(effects[3]).toEqual(put(restartGameCompleted()));
  });

  it("performs no further work", () => {
    expect(effects.length).toEqual(4);
  });
});