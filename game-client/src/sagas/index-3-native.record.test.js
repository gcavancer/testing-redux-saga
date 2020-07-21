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

import { runSaga } from "redux-saga";

describe("restartGameSaga() ", () => {
  let dispatchedActions = [];
  let fakeStore;

  api.apiRestartGame = jest.fn();

  beforeEach(() => {
    fakeStore = {
      dispatch: (action) => dispatchedActions.push(action),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    dispatchedActions = [];
  })

  it("should call start > api > complete when apiRestartGame is successful ", async () => {
    const data = { mockData: "mock" };
    const details = { data };
    api.apiRestartGame.mockImplementation(() => details);
    const initAction = { type: types.RESTART_GAME };
    
    await runSaga(fakeStore, restartGameSaga, initAction).toPromise();

    expect(dispatchedActions).toContainEqual(actions.restartGameStarted());
    expect(api.apiRestartGame).toHaveBeenCalledTimes(1);
    expect(dispatchedActions).toContainEqual(actions.restartGameCompleted(data));
  });

  it("should catch error when apiRestartGame fails ", async () => {
    api.apiRestartGame.mockImplementation(() => {
      throw new Error("mock error");
    });
    const initAction = { type: types.RESTART_GAME };
    
    await runSaga(fakeStore, restartGameSaga, initAction).toPromise();

    expect(dispatchedActions).toContainEqual(actions.restartGameStarted());
    expect(dispatchedActions).toContainEqual(
      actions.requestFailed("Error: mock error")
    );
  });
});