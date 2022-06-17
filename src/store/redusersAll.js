import { createStore, combineReducers } from "redux";
import { reduser_ActiveDialogAddItem } from "./reduserActiveDialogAddItem.js";

// --------------------------------------
const all_redusers = combineReducers(
    {
        m_reduser_ActiveDialogAddItem: reduser_ActiveDialogAddItem, 
    }
)

const globStore = createStore(all_redusers);
export { globStore };





