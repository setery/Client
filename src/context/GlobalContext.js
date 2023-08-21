import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// initial state
const initialState = {
  user: null,
  fetchingUser: true,
  completeToDos: [],
  incompleteToDos: [],
};

// reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, fetchingUser: false };
    case "SET_COMPLETE_TODOS":
      return {
        ...state,
        completeToDos: action.payload,
      };
    case "SET_INCOMPLETE_TODOS":
      return {
        ...state,
        incompleteToDos: action.payload,
      };
    case "RESET_USER":
      return {
        ...state,
        user: null,
        completeToDos: [],
        incompleteToDos: [],
        fetchingUser: false,
      };
    default:
      return state;
  }
};

// create the context
export const GlobalContext = createContext(initialState);

// provider comp
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  // action: get current user
  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/auth/current");
      if (res.data) {
        const toDosRes = await axios.get("/data/current"); //fix
        if (toDosRes.data) {
          dispatch({ type: "SET_USER", payload: res.data });
          dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: toDosRes.data.complete,
          });
          dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: toDosRes.data.incomplete,
          });
        }
      } else {
        dispatch({ type: "RESET_USER" });
      }
    } catch (err) {
      dispatch({ type: "RESET_USER" });
    }
  };
  const logout = async () => {
    try {
      await axios.put("/auth/logout");
      dispatch({ type: "RESET_USER" });
    } catch (err) {
      dispatch({ type: "RESET_USER" });
    }
  };

  const addToDo = (toDo) => {
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: [toDo, ...state.incompleteToDos],
    });
  };

  const toDoComplete = (toDo) => {
    const newArray = state.incompleteToDos.filter(
      (item) => !toDo.uuid.includes(item.uuid)
    );

    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: newArray,
    });

    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: [toDo, ...state.completeToDos],
    });
  };

  const toDoIncomplete = (toDo) => {
    const newArray = state.completeToDos.filter(
      (item) => !toDo.uuid.includes(item.uuid)
    );

    dispatch({
      type: "SET_COMPLETE_TODOS",
      payload: newArray,
    });
    dispatch({
      type: "SET_INCOMPLETE_TODOS",
      payload: [toDo, ...state.incompleteToDos],
    });
  };

  const removeToDo = (toDo) => {
    if (toDo.complete === 1) {
      const newArray = state.completeToDos.filter(
        (item) => item.uuid !== toDo.uuid
      );

      dispatch({
        type: "SET_COMPLETE_TODOS",
        payload: newArray,
      });
    } else {
      const newArray = state.incompleteToDos.filter(
        (item) => item.uuid !== toDo.uuid
      );
      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: newArray,
      });
    }
  };

  const updateToDo = (toDo) => {
    if (toDo.complete === 1) {
      const newCompleteToDos = state.completeToDos.map((completeToDo) =>
        completeToDo.uuid !== toDo.uuid ? completeToDo : toDo
      );

      dispatch({
        type: "SET_COMPLETE_TODOS",
        payload: newCompleteToDos,
      });
    } else {
      const newIncompleteToDos = state.incompleteToDos.map((incompleteToDo) =>
        incompleteToDo.uuid !== toDo.uuid ? incompleteToDo : toDo
      );

      dispatch({
        type: "SET_INCOMPLETE_TODOS",
        payload: newIncompleteToDos,
      });
    }
  };

  const value = {
    ...state,
    getCurrentUser,
    logout,
    addToDo,
    toDoComplete,
    toDoIncomplete,
    removeToDo,
    updateToDo,
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};
export function useGlobalContext() {
  return useContext(GlobalContext);
}
