import { useContext, useEffect, useReducer, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { GlobalContext } from "../../GlobalWrapper";
import { ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Grid, TextField, Typography, createTheme } from "@mui/material";
import colors from "../../utils/colors"
import formContainerStyles from "./AddProduct.module.css"
import { useNavigate } from "react-router-dom";
import impValues from "../../utils/impValues";

// import EmailIcon from '@mui/icons-material/Email';

const AddProduct = () => {
    const { globalData, globalDataDispatch } = useContext(GlobalContext)
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      };
      const navigate = useNavigate();
      useEffect(()=>{
        if(!(localStorage.getItem('userData'))){
            navigate('/sign-in')
        }
      },[])
    const addProductHandler = ()=>{

        if(addProductData.title.length==0 || addProductData.price.length ==0 || addProductData.description.length ==0 || !selectedFile ){
            globalDataDispatch({
                type: 'createAlert',
                value: {
                    alertType: 'error',
                    message: 'every feild is required...!!!'
                }
            })
        }
        else if(isNaN(addProductData.price)){
            globalDataDispatch({
                type: 'createAlert',
                value: {
                    alertType: 'error',
                    message: 'price should be a number'
                }
            })
        }
        else{


            //....
            const formData = new FormData();
            formData.append('title',addProductData.title)
            formData.append('price',addProductData.price)
            formData.append('description',addProductData.description)
            formData.append('image',selectedFile)
            
            console.log('formData:-   ',formData);
            let resStatus = null
            const headers = new Headers({
                authorization: `Bearer ${globalData.userData.token}`,
              });
              globalDataDispatch({
                type: 'showLoader'
            })
            fetch(impValues.backendLink + '/add-product', {
                
                method: 'POST',
                body: formData,
                headers: headers
              })
            .then((response)=>{
                globalDataDispatch({
                    type: 'hideLoader'
                })
                console.log('res ',response)
                resStatus = response.status
                    return response.json()
                 
            })
            .then(data=>{
                console.log('login Result:', data)
                if (resStatus < 200 || resStatus > 299) {
                    let newAlert = {
                        type: 'error',
                        message: data.message
                    }
                    throw newAlert
                }
                globalDataDispatch({
                    type: 'createAlert',
                    value: {
                        alertType:'success',
                        message: data.message
                    }
                })
                navigate('/products')
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
    }
    const theme = createTheme({
        palette: {
            primary: {
                main: colors.darkMud,
            },
            secondary: {
                main: colors.grassGreen
            }
        }
    });

    

    const addProductReducer = (state, action) => {
        let newState = {}
        switch (action.type) {

            case 'updateTitle':
                newState = {
                    ...state,
                    title: action.value
                }
                return newState;
            case 'updatePrice':
                newState = {
                    ...state,
                    price: action.value
                }
                return newState;
            case 'updateDescription':
                newState = {
                    ...state,
                    description: action.value
                }
                return newState;
        }


    }

    const [addProductData, addProductDispatch] = useReducer(addProductReducer, {
        title: '',
        price: '',
        description: '',
        userToken: globalData.userData.token

    })
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
      
      const inMobile = useMediaQuery({ query: '(max-width: 990px)' })

      const showImage = <>
      <Grid mt={2}>
      <img src={previewUrl} style={{
        height: '75%',
        width: '100%'
      }} alt="Preview" />
      </Grid>
      </>
    return (

       
        <>
            <Grid container justifyContent="center" alignItems="start" py={15} sx={{
                height: 'auto'
            }} >
                <Grid xs={11} md={6} lg={4} sx={{
                    px: {
                        xs: 2,
                        md: 7
                    },
                    py: {
                        xs: 4,
                        md: 7
                    }
                }} className={formContainerStyles.container + ' ' + formContainerStyles.transparentBackground + ' ' + (inMobile ? formContainerStyles.shadowMobile : formContainerStyles.shadow)}>
                    <Grid mb={1}>
                        <Typography variant="h3"
                            textAlign='center'>
                            Add Product
                        </Typography>
                    </Grid>





                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            {/* <EmailIcon sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} /> */}
                            <ThemeProvider theme={theme}>
                                <TextField
                                    //size='medium'
                                    sx={{
                                        ".MuiInputBase-input": {
                                            fontSize: "1.17rem", // Increase font size to 1.5rem
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem", // Adjust minHeight to match input font size
                                        },
                                    }}

                                    color='primary'
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updateTitle',
                                            value: e.target.value
                                        }
                                     addProductDispatch(action);
                                        
                                    }}
                                   

                                    fullWidth id="input-with-sx" label="title" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>

                    <Grid mb={2}>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
      Upload Image
      <VisuallyHiddenInput name='image' onChange={handleFileChange} type="file" />
    </Button>

                    </Grid>

                    {previewUrl && showImage}

                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            {/* <EmailIcon sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} /> */}
                            <ThemeProvider theme={theme}>
                                <TextField
                                    //size='medium'
                                    sx={{
                                        ".MuiInputBase-input": {
                                            fontSize: "1.17rem", // Increase font size to 1.5rem
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem", // Adjust minHeight to match input font size
                                        },
                                    }}

                                    color='primary'
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updatePrice',
                                            value: e.target.value
                                        }
                                        addProductDispatch(action);
                                        
                                    }}
                                   

                                    fullWidth id="input-with-sx" label="price" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>

                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            {/* <EmailIcon sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} /> */}
                            <ThemeProvider theme={theme}>
                                <TextField
                                    //size='medium'
                                    sx={{
                                        ".MuiInputBase-input": {
                                            fontSize: "1.17rem", // Increase font size to 1.5rem
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem", // Adjust minHeight to match input font size
                                        },
                                    }}

                                    color='primary'
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updateDescription',
                                            value: e.target.value
                                        }
                                        addProductDispatch(action);
                                        
                                    }}
                                   

                                    fullWidth id="input-with-sx" label="description" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>

                   







                    <Grid pl={1} pt={2}>

                        <ThemeProvider theme={theme}>
                            <Button color={'primary'} onClick={addProductHandler} variant='contained' size='large' fullWidth >
                                Add Product
                            </Button>
                        </ThemeProvider>

                    </Grid>



                </Grid>
            </Grid>
        </>
    )
}

export default AddProduct;