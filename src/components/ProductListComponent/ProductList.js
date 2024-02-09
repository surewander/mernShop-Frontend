import { Grid } from "@mui/material"
import ProductCard from "../ProductCardComponent/ProductCard"
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../GlobalWrapper"
import { useNavigate } from "react-router-dom"
import impValues from "../../utils/impValues"

const ProductList = (props) => {
    const { globalData, globalDataDispatch } = useContext(GlobalContext)
    const navigate = useNavigate()
    const [products, setProducts] = useState([]);
    useEffect(() => {
        if(!(localStorage.getItem('userData'))){
            navigate('/sign-in')
        }
        
        
        else {
            let signInAction = JSON.parse(localStorage.getItem('userData'))
            console.log('sign in action:- ',signInAction)
            //globalDataDispatch(signInAction)
            console.log();
            let resStatus = null

            const headers = new Headers({
                authorization: `Bearer ${signInAction.value.token}`,

            });
            globalDataDispatch({
                type: 'showLoader'
            })
            fetch(impValues.backendLink + '/products', {
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
                    console.log('login Result:', data)
                    if (resStatus < 200 || resStatus > 299) {
                        let newAlert = {
                            type: 'error',
                            message: data.message
                        }
                        throw newAlert
                    }
                   
                    setProducts(data.products)
                })
                .catch(error => {

                    console.log('error:- ', error);
                    globalDataDispatch({
                        type: 'createAlert',
                        value: {
                            alertType: error.type,
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

               <h2>Product List...!!!</h2> 
                </Grid>


                {
                    products.map((product) => {
                        return (
                            <Grid xs={11} m={3} alignSelf={'strech'} sx={{
                                
                            }} key={product._id} md={3}>
                                <ProductCard product={product}></ProductCard>
                            </Grid>
                        )
                    })
                }

            </Grid>
        </>
    )
}

export default ProductList;