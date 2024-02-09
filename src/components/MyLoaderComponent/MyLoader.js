
import { useContext } from "react";
import loaderStyles from "./MyLoader.module.css"
import { GlobalContext } from "../../GlobalWrapper";
import { Backdrop, CircularProgress } from "@mui/material";

const MyLoader = () => {

    let {globalData,globalDataDispatch} = useContext(GlobalContext)
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={globalData.loaderData.open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default MyLoader;