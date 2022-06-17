const default_activeDialogAddItem = {
    isActive_dialog_Window: false,
}

const reduser_ActiveDialogAddItem = (my_state = default_activeDialogAddItem, my_action) => {
    switch (my_action.type) {

        case "SET_isActive_dialog_Window_TRUE":
            return { ...my_state, isActive_dialog_Window: true }

        case "SET_isActive_dialog_Window_FALSE":
            return { ...my_state, isActive_dialog_Window: false }

        default: return my_state;
    }
}

export { reduser_ActiveDialogAddItem }

