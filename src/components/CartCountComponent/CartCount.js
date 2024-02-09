import { Typography } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { GlobalContext } from "../../GlobalWrapper";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


const CartCount = () => {


    const {globalData, globalDataDispatch} = useContext(GlobalContext)
    const navigate = useNavigate();
    return (
        <><span style={{
            display: 'flex',
            cursor: 'pointer'
        }}  onClick={()=>{
            navigate('/cart')
          }}>

            <Typography
                sx={{
                    my: 2, color: 'white', pl: 1


                }

                }
                pt={1}



            >
                <ShoppingCartIcon />
            </Typography>
            <Typography
                sx={{
                    my: 2, color: 'white', pr: 1,
                }

                }
                pt={0}



            >
                {globalData.cartCount}
            </Typography>
        </span>

        </>
    )
}

export default CartCount