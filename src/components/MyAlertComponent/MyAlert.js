import { Alert, Snackbar } from "@mui/material"
import { useContext } from "react";
import { GlobalContext } from "../../GlobalWrapper";



const MyAlert = (props) => {
    const { globalData, globalDataDispatch } = useContext(GlobalContext)
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={props.open} autoHideDuration={7000} onClose={() => {
                globalDataDispatch({
                    type: 'closeAlert',
                    value: null
                })

            }} >
                <Alert onClick={
                    () => {
                        globalDataDispatch({
                            type: 'closeAlert',
                            value: null
                        })
                    }
                } severity={props.alertType}>
                    {props.message}
                </Alert>
            </Snackbar>

        </>
    )
}

export default MyAlert;