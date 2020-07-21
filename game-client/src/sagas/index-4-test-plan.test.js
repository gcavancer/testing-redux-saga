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

import { testSaga, expectSaga } from "redux-saga-test-plan";

import gameReducer from "../components/game/reducer";

describe("verifyGuessSaga() unit test with redux-saga-test-plan", () => {
  const guess = 100;
  const action = { type: types.VERIFY_GUESS, payload: guess };
  it("works where and deviation !=== 0", () => {
    testSaga(verifyGuessSaga, action)
      .next()
      .put(verifyGuessStarted())
      .next()
      .select(getOriginal)
      .next()
      .put(verifyGuessCompleted())
      .next()
      .isDone();
  });
  it("works where and deviation === 0", () => {
    testSaga(verifyGuessSaga, action)
      .next()
      .put(verifyGuessStarted())
      .next()
      .select(getOriginal)
      .next(100)
      .select(getWin)
      .next()
      .put(registerWin())
      .next()
      .put(verifyGuessCompleted())
      .next()
      .isDone();
  });
  it("works where API is broken and throws an exception", () => {
    const error = new Error("404 Not Found");
    testSaga(verifyGuessSaga, action)
      .next()
      .put(verifyGuessStarted())
      .next()
      .select(getOriginal)
      .next(100)
      .select(getWin)
      .next()
      .put(registerWin())
      .throw(error)
      .put(requestFailed("Error: 404 Not Found"))
      .next()
      .isDone();
  });
});

describe("verifyGuessSaga() integration test with redux-saga-test-plan", () => {
  const guess = 100;
  const action = { type: types.VERIFY_GUESS, payload: guess };
  it("leaves final state as expected", () => {
    return expectSaga(verifyGuessSaga, action)
      .withReducer(gameReducer)
      .provide([
        [select(getOriginal), 100],
        [select(getWin), 20],
      ])
      .hasFinalState({
        average: "",
        deviation: "",
        original: "",
        guesses: 0,
        win: {},
        message: "",
        loading: false,
      })
      .run();
  });
});
