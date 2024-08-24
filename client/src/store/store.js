import { createStore } from "easy-peasy";
import userModel from "./userModel";

const store = createStore({
  user: userModel,
});

export default store;
