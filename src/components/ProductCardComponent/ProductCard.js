import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import colors from '../../utils/colors';
import impValues from '../../utils/impValues';
import { GlobalContext } from '../../GlobalWrapper';




const ProductCard = (props) => {
    const { globalData, globalDataDispatch } = React.useContext(GlobalContext)
    const addToCartHandler = (productId) => {
        let cartItem = {
            productId: productId,
            quantity: 1
        }
        let obj = {
            cartItem: cartItem
        }
        const headers = new Headers({
            authorization: `Bearer ${globalData.userData.token}`,
            'Content-Type': 'application/json'
        });
        let resStatus = null;
        globalDataDispatch({
            type: 'showLoader'
        })
       
        fetch(impValues.backendLink + '/add-to-cart', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(obj)

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
                globalDataDispatch({
                    type: 'updateCartCount',
                    value: data.cartCount
                })
                globalDataDispatch({
                    type: 'createAlert',
                    value: {
                        alertType: 'success',
                        message: data.message
                    }
                })
                // navigate('/products')
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
                // setMyAlert({
                //     type: error.type,
                //     message: error.message
                // })
                // setShowAlert(true)
            })
    }


    return (
        <Card sx={{ maxWidth: 345, height: '100%', backgroundColor: colors.grassGreen }}>
            <CardMedia
                sx={{ height: 140 }}
                image={impValues.backendLink +  '/Images/' + props.product.image}
                title={props.product.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">price: {props.product.price}</Button>
                <Button size="small" onClick={() => {
                    addToCartHandler(props.product._id)
                }} variant='contained'>Add To Cart</Button>
            </CardActions>
        </Card>
    );

}

export default ProductCard