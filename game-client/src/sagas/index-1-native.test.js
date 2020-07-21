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
import * as api from "../api";
import * as actions from "../components/game/actions";
import {
  verifyGuessSaga,
  registerWinSaga,
  restartGameSaga,
  getWin,
  getOriginal,
} from "./index";

describe("verifyGuessSaga() ", () => {
  const guess = 100;
  const action = { type: types.VERIFY_GUESS, payload: guess };
  const generator = verifyGuessSaga(action);
  it("calls verifyGuessStarted action", () => {
    expect(generator.next().value).toEqual(put(actions.verifyGuessStarted()));
  });
  it("calls getOriginal select", () => {
    expect(generator.next().value).toEqual(select(getOriginal));
  });
  it("calls verifyGuessCompleted when deviation !=== 0", () => {
    expect(generator.next().value).toEqual(put(actions.verifyGuessCompleted()));
  });
  it("then completes", () => {
    expect(generator.next().done).toBeTruthy();
  });
  it("calls getWin & registerWin when deviation === 0", () => {
    const action = { type: types.VERIFY_GUESS, payload: guess };
    const generator = verifyGuessSaga(action);
    expect(generator.next().value).toEqual(put(actions.verifyGuessStarted()));
    expect(generator.next().value).toEqual(select(getOriginal));
    expect(generator.next(100).value).toEqual(select(getWin));
    expect(generator.next().value).toEqual(put(actions.registerWin()));
    expect(generator.next().value).toEqual(put(actions.verifyGuessCompleted()));
  });
  it("then completes", () => {
    expect(generator.next().done).toBeTruthy();
  });
  describe("Scenario: API is broken and throws an exception", () => {
    const guess = 100;
    const action = { type: types.VERIFY_GUESS, payload: guess };
    const generator = verifyGuessSaga(action);
    it("calls verifyGuessStarted action", () => {
      expect(generator.next().value).toEqual(put(actions.verifyGuessStarted()));
    });
    it("then triggers an error action with the error message", () => {
      const error = new Error("404 Not Found");
      expect(generator.throw(error).value).toEqual(
        put(actions.requestFailed("Error: 404 Not Found"))
      );
    });
    it("then completes", () => {
      expect(generator.next().done).toBeTruthy();
    });
  });
});

describe("restartGameSaga() ", () => {
  const generator = restartGameSaga();
  const response = { data: 1 };
  it("calls restartGameStarted action", () => {
    expect(generator.next().value).toEqual(put(actions.restartGameStarted()));
  });
  it("calls apiRestartGame", () => {
    expect(generator.next().value).toEqual(call(api.apiRestartGame));
  });
  it("delays for 1s", () => {
    expect(generator.next(response).value).toEqual(delay(1000));
  });
  it("calls restartGameCompleted action", () => {
    expect(generator.next().value).toEqual(
      put(actions.restartGameCompleted(response.data))
    );
  });
  it("then completes", () => {
    expect(generator.next().done).toBeTruthy();
  });
  describe("[Scenario] API call fails and throws an exception", () => {
    const generator = restartGameSaga();
    it("calls restartGameStarted action", () => {
      expect(generator.next().value).toEqual(put(actions.restartGameStarted()));
    });
    it("calls apiRestartGame", () => {
      expect(generator.next().value).toEqual(call(api.apiRestartGame));
    });
    it("then triggers an error action with the error message", () => {
      const error = new Error("404 Not Found");
      expect(generator.throw(error).value).toEqual(
        put(actions.requestFailed("Error: 404 Not Found"))
      );
    });
    it("then completes", () => {
      expect(generator.next().done).toBeTruthy();
    });
  });
});

describe("registerWinSaga() ", () => {
  const win = { guesses: 10 };
  const action = { type: types.REGISTER_WIN, payload: win };
  const generator = registerWinSaga(action);
  it("calls registerWinStarted action", () => {
    expect(generator.next().value).toEqual(put(actions.registerWinStarted()));
  });
  it("calls apiWin with payload", () => {
    expect(generator.next().value).toEqual(call(api.apiWin, action.payload));
  });
  it("delays for 1s", () => {
    expect(generator.next().value).toEqual(delay(1000));
  });
  it("calls registerWinCompleted action", () => {
    expect(generator.next().value).toEqual(put(actions.registerWinCompleted()));
  });
  it("delays for 1s", () => {
    expect(generator.next().value).toEqual(delay(1000));
  });
  it("calls restartGame action", () => {
    expect(generator.next().value).toEqual(put(actions.restartGame()));
  });
  it("then completes", () => {
    expect(generator.next().done).toBeTruthy();
  });
  describe("[Scenario] API call fails and throws an exception", () => {
    const win = { guesses: 10 };
    const action = { type: types.REGISTER_WIN, payload: win };
    const generator = registerWinSaga(action);
    it("calls registerWinStarted action", () => {
      expect(generator.next().value).toEqual(put(actions.registerWinStarted()));
    });
    it("calls apiWin with payload", () => {
      expect(generator.next().value).toEqual(call(api.apiWin, action.payload));
    });
    it("then triggers an error action with the error message", () => {
      const error = new Error("404 Not Found");
      expect(generator.throw(error).value).toEqual(
        put(actions.requestFailed("Error: 404 Not Found"))
      );
    });
    it("then completes", () => {
      expect(generator.next().done).toBeTruthy();
    });
  });
});
