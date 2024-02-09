import { Box, Button, Divider, IconButton, InputAdornment, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import colors from "../../utils/colors"
import formContainerStyles from "./SigninForm.module.css"
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import formVerification from '../../utils/formVerification';
import { useContext, useEffect, useReducer, useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import { GlobalContext } from '../../GlobalWrapper';
import { Link, useNavigate } from 'react-router-dom';
import impValues from '../../utils/impValues';
import { Visibility, VisibilityOff } from '@mui/icons-material';

//import makeStyles from '@mui/styles'

const SigninForm = () => {

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

    const inMobile = useMediaQuery({ query: '(max-width: 990px)' })

    const [passwordVisible, setPasswordVisible] = useState(false)



    const [canSignin, setCanSignin] = useState(false);

    const { globalData, globalDataDispatch } = useContext(GlobalContext)
    const navigate = useNavigate();





    const togglePassword = () => {
        setPasswordVisible((prevState) => {
            return !prevState;
        })
    }

    const signInHandler = () => {
        const myData = {
            email: signinFormData.email.value.trim().toLowerCase(),
            password: signinFormData.password.value.trim(),
        }
        let resStatus = null;
        globalDataDispatch({
            type: 'showLoader'
        })
        fetch(impValues.backendLink + '/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(myData)
        })
            .then(response => {
                globalDataDispatch({
                    type: 'hideLoader'
                })
                console.log('sign In response:- ', response)
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
                // redirect to home page with sign in data
                globalDataDispatch({
                    type: 'createAlert',
                    value: {
                        alertType: 'success',
                        message: 'Signed In Successfully...!!!'
                    }
                })
                let signInAction = {
                    type: 'signIn',
                    value: {
                        email: data.email,
                        id: data.id,
                        token: data.token
                    },
                    cartCount: data.cartCount
                }
                localStorage.setItem('userData', JSON.stringify(signInAction))
                globalDataDispatch(signInAction)
                navigate('/add-product')


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
                // setMyAlert({
                //     type: error.type,
                //     message: error.message
                // })
                // setShowAlert(true)
            });
    }




    const signinFormReducer = (state, action) => {
        //state = JSON.parse(JSON.stringify(state));
        switch (action.type) {

            case "validateEmail":
                //logic
                let emailResult = formVerification(state.email.value, ['isNotEmpty', 'isEmail'])
                return {
                    ...state,
                    email: {
                        ...state.email,
                        ok: emailResult.ok,
                        helperText: emailResult.message
                    }
                }
            //return in end

            case "validatePassword":
                //..
                let passwordResult = formVerification(state.password.value, ['isNotEmpty'])
                return {
                    ...state,
                    password: {
                        ...state.password,
                        ok: passwordResult.ok,
                        helperText: passwordResult.message
                    }
                }


            case "updateEmail":
                return {
                    ...state,
                    email: {
                        ...state.email,
                        value: action.value
                    }
                }

            case "updatePassword":
                return {
                    ...state,
                    password: {
                        ...state.password,
                        value: action.value
                    }
                }

        }

    }
    const [signinFormData, signinFormDispatch] = useReducer(signinFormReducer, {

        email: {
            value: '',
            ok: true,
            helperText: ''
        },

        password: {
            value: '',
            ok: true,
            helperText: ''
        }


    })

    useEffect(() => {
        let errCheck = true;
        for (const key in signinFormData) {
            if (!(signinFormData[key].value != '' && signinFormData[key].ok == true)) {
                errCheck = false
                break;
            }
        }
        setCanSignin(errCheck)
    }, [signinFormData])



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
                            Sign In
                        </Typography>
                    </Grid>
                    <Grid mb={2}>
                        <Typography
                            textAlign='center'
                            sx={{
                                color: '#221100'
                            }}>
                            With your social network
                        </Typography>
                    </Grid>
                    <Grid container mb={2} xs={12} alignItems={'strech'} justifyContent={'space-around'}   >
                        <Grid xs={5} >
                            <Button variant="contained"
                                fullWidth={true}

                                sx={{
                                    backgroundColor: "#EDEADE",
                                    color: "black", // Adjust text color for contrast
                                    '&:hover': {
                                        backgroundColor: "#FFFFF0", // Hover color
                                    },
                                    '&:focus': {
                                        boxShadow: "0 0 0 0.2rem rgba(0, 0, 0, 0.15)", // Focus outline
                                    },
                                    fontSize: '1.1em',
                                    alignSelf: "end",



                                }}>
                                <GoogleIcon sx={{
                                    fontSize: '1.7em',
                                    paddingRight: '0.2em',
                                    paddingTop: '0.1em',
                                    paddingBottom: '0.1em',
                                }
                                }
                                />
                                <span style={{
                                    marginTop: '0.1em'
                                }}


                                >
                                    Google
                                </span>

                            </Button>
                        </Grid>
                        <Grid xs={5} >
                            <Button variant="contained"
                                fullWidth

                                sx={{
                                    backgroundColor: "#316FF6",
                                    color: "white", // Adjust text color for contrast
                                    '&:hover': {
                                        backgroundColor: "#5a8bf7" // Hover color
                                    },
                                    '&:focus': {
                                        boxShadow: "0 0 0 0.2rem rgba(0, 0, 0, 0.15)", // Focus outline
                                    },
                                    fontSize: '1.1em',
                                    alignSelf: "end",

                                }}>
                                <FacebookIcon sx={{
                                    fontSize: '1.7em',
                                    paddingRight: '0.2em',
                                    //paddingTop: '0.1em',
                                    paddingBottom: '0.1em',
                                }
                                }
                                />
                                <span style={{
                                    marginTop: '0.1em'
                                }}


                                >
                                    Facebook
                                </span>

                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container mb={2} alignItems={'center'}>
                        <Grid xs={5}>
                            <Divider sx={{
                                bgcolor: colors.darkMud, // Change the color here
                                height: '1px', // Change the height here in pixels
                                opacity: '0.4'
                            }} />
                        </Grid>

                        <Grid xs={2} sx={{
                            textAlign: 'center'
                        }}>
                            OR
                        </Grid>

                        <Grid xs={5}>
                            <Divider sx={{
                                bgcolor: colors.darkMud, // Change the color here
                                height: '1px', // Change the height here in pixels
                                opacity: '0.4'
                            }} />
                        </Grid>

                    </Grid>



                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <EmailIcon sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} />
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
                                            type: 'updateEmail',
                                            value: e.target.value
                                        }
                                        signinFormDispatch(action);
                                        let action2 = {
                                            type: 'validateEmail',
                                            value: null
                                        }
                                        signinFormDispatch(action2)

                                    }}
                                    onBlur={(e) => {
                                        let action = {
                                            type: 'validateEmail',
                                            value: null
                                        }
                                        signinFormDispatch(action)
                                    }}
                                    error={!signinFormData.email.ok}
                                    helperText={signinFormData.email.helperText}
                                    fullWidth id="input-with-sx" label="Email" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>



                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <LockIcon sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} />
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
                                    InputProps={{
                                        endAdornment: (
                                            < InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={togglePassword}
                                                    //onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}

                                    type={passwordVisible ? 'text' : 'password'}
                                    error={!signinFormData.password.ok}
                                    helperText={signinFormData.password.helperText}
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updatePassword',
                                            value: e.target.value
                                        }
                                        signinFormDispatch(action)
                                        action = {
                                            type: 'validatePassword',
                                            value: null
                                        }
                                        signinFormDispatch(action)

                                    }}
                                    onBlur={() => {
                                        let action = {
                                            type: 'validatePassword',
                                            value: null
                                        }
                                        signinFormDispatch(action)

                                    }}
                                    color='primary'
                                    fullWidth id="input-with-sx" label="Password" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>



                    <Grid pl={1} pt={2}>

                        <ThemeProvider theme={theme}>
                            <Button disabled={!canSignin} color={'primary'} onClick={signInHandler} variant='contained' size='large' fullWidth >
                                Sign In
                            </Button>
                        </ThemeProvider>

                    </Grid>

                    <Grid mt={2} textAlign={'center'} fontSize={'1em'}>
                        <span>Don't have an account? </span><Link
                            style={{
                                textDecoration: 'none',
                            }}
                            to={'/'} > <span style={{ color: '#316FF6' }}>Sign Up</span> </Link>
                    </Grid>

                </Grid>
            </Grid>
        </>
    )
}

export default SigninForm;