import { Grid } from "@mui/material"
//import ProductCard from "../ProductCardComponent/ProductCard"
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../GlobalWrapper"
import { useNavigate } from "react-router-dom"
import CartCard from "../CartCardComponent/CartCard"
import impValues from "../../utils/impValues"

const CartList = (props) => {
    const { globalData, globalDataDispatch } = useContext(GlobalContext)
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState({})
    useEffect(() => {
        if(!(localStorage.getItem('userData'))){
            navigate('/sign-in')
        }
        
        
        else {
            let signInAction = JSON.parse(localStorage.getItem('userData'))
            globalDataDispatch(signInAction)
            console.log();
            let resStatus = null

            const headers = new Headers({
                authorization: `Bearer ${signInAction.value.token}`,
            });
            globalDataDispatch({
                type: 'showLoader'
            })
            fetch(impValues.backendLink + '/cart', {
                headers: headers
            })
                .then((response) => {
                    globalDataDispatch({
                        type: 'hideLoader'
                    })
                    console.log('res ', response)
                    resStatus = response.status
                    return response.json()

                })
                .then(data => {
                    console.log('cart Result:', data)
                    if (resStatus < 200 || resStatus > 299) {
                        let newAlert = {
                            type: 'error',
                            message: data.message
                        }
                        throw newAlert
                    }
                    setCart(data.cart)
                    setCartItems(data.cart.cartItems)
                    globalDataDispatch({
                        type: 'updateCartCount',
                        value: data.cart.count
                    })
                })
                .catch(error => {

                    console.log('error:- ', error);
                    globalDataDispatch({
                        type: 'createAlert',
                        value: {
                            alertType: 'error',
                            message: error.message
                        }
                    })
                })
        }
    }, [])



    return (
        <>

            
            <Grid container mt={9}  justifyContent={'center'}>
                <Grid xs={11} sx={{
                    textAlign: 'center'
                }}>

               <h2>Cart Items...!!!</h2> 
                </Grid>


                {
                    cartItems.map((cartItem) => {
                        return (
                            <Grid xs={11} m={3} alignSelf={'strech'} sx={{
                                
                            }} key={cartItem.product._id} md={3}>
                                <CartCard cartItem={cartItem}></CartCard>
                            </Grid>
                        )
                    })
                }

            </Grid>
        </>
    )
}

export default CartList;