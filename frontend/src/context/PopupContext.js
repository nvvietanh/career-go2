import { createContext, useState } from "react";

import MessagePopup from "../lib/MessagePopup";


const PopupContext = createContext();

const PopUpProvider = ({children}) => {
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const val = {popup, setPopup}

  return (
    <PopupContext.Provider value={val}>
        {children}
    </PopupContext.Provider>
  )
}

// const PopupState = () => {
//   return useContext(PopupContext);
// }

export { PopupContext, PopUpProvider };