import { useContext } from "react";
import { SocialMediaContext } from "../context/SocialMediaContext";

export const useSocialMediaContext = () => {
    const { context, dispatch } = useContext(SocialMediaContext)

    const errorDispatch = (errorMessage) => {
        dispatch({ type: "ERROR", payload: { error: errorMessage } })
    }

    const successDispatch = (messageToUser) => {
        dispatch({ type: "SEND_MESSAGE_TO_USER", payload: { messageToUser } })
    }

    const commonDispatch = (type, payload) => {
        dispatch({ type, payload })
    }
    
    return {
        context, errorDispatch, successDispatch, commonDispatch
    }
}