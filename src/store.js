import { configureStore, createSlice } from '@reduxjs/toolkit';

const saveToLocalStorage = (todos) => {
  try {
    localStorage.setItem('toDos', JSON.stringify(todos));
  } catch (e) {
    console.warn(e);
    return null;
  }
};

const todoSlice = createSlice({
  name: 'todoReducer',
  initialState: [],
  reducers: {
    add: (state, action) => {
      state.unshift({ text: action.payload, id: Date.now() });
      saveToLocalStorage(state);
    },
    del: (state, action) => {
      const newState = state.filter((s) => s.id !== action.payload);
      saveToLocalStorage(newState);
      return newState;
    },
  },
});

const loadFromLocalStorage = () => {
  try {
    const localState = localStorage.getItem('toDos');
    if (localState === null) {
      return undefined;
    }
    return JSON.parse(localState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};

const store = configureStore({
  reducer: todoSlice.reducer,
  preloadedState: loadFromLocalStorage(),
});

export const { add, del } = todoSlice.actions;
export default store;
