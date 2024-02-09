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




const CartCard = (props) => {
    const { globalData, globalDataDispatch } = React.useContext(GlobalContext)
    console.log('props:- ',props)
   


    return (
        <Card sx={{ maxWidth: 345, height: '100%', backgroundColor: colors.grassGreen }}>
            <CardMedia
                sx={{ height: 140 }}
                image={impValues.backendLink + '/Images/' + props.cartItem.product.image}
                title={props.cartItem.product.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.cartItem.product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.cartItem.product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">price: {props.cartItem.product.price}</Button>
                <Button size="small">QTY: {props.cartItem.quantity}</Button>
            </CardActions>
        </Card>
    );

}

export default CartCard