import { Box, Button, Divider, IconButton, InputAdornment, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import colors from "../../utils/colors"
import formContainerStyles from "./SignupForm.module.css"
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';

import LockIcon from '@mui/icons-material/Lock';
import formVerification from '../../utils/formVerification';
import { useContext, useEffect, useReducer, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { GlobalContext } from '../../GlobalWrapper';
import { Link, useNavigate } from 'react-router-dom';
import impValues from '../../utils/impValues';
//import makeStyles from '@mui/styles'

const SignupForm = () => {

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
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);

    const [canSignup, setCanSignup] = useState(false);

    const { globalData, globalDataDispatch } = useContext(GlobalContext)


    // const [myAlert, setMyAlert] = useState({
    //     type: '',
    //     message: ''
    // })

    // const closeAlert = () => {
    //     setShowAlert(false)
    // }

    const togglePassword = () => {
        setPasswordVisible((prevState) => {
            return !prevState;
        })
    }

    const toggleConfirmPassword = () => {
        setConfirmPasswordVisible((prevState) => {
            return !prevState;
        })
    }


    const signupHandler = () => {
        let myData = {
            fullName: signupFormData.fullName.value.trim(),
            email: (signupFormData.email.value.trim()).toLowerCase(),
            password: signupFormData.password.value.trim()
        }
        let resStatus = null;
        globalDataDispatch({
            type: 'showLoader'
        })
        fetch(impValues.backendLink+ '/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(myData)
        })
            .then(response => {
                console.log('response:- ',response)
                globalDataDispatch({
                    type: 'hideLoader'
                })
                resStatus = response.status;
                return response.json()
            })
            .then(data => {
                if (resStatus < 200 || resStatus > 299) {
                    let newAlert = {
                        type: 'error',
                        message: data.message
                    }
                    throw newAlert;
                }
                console.log('User created:', data)
                globalDataDispatch({
                    type: 'createAlert',
                    value: {
                        alertType: 'success',
                        message: data.message
                    }
                })
                navigate('/sign-in')
            })
            .catch(error => {

                console.error('Error:', error)
                globalDataDispatch({
                    type: 'createAlert',
                    value: {
                        alertType: error.type,
                        message: error.message
                    }
                })
            });

    }
    const signupFormReducer = (state, action) => {
        //state = JSON.parse(JSON.stringify(state));
        switch (action.type) {
            case "validateFullName":
                //logic
                let nameResult = formVerification(state.fullName.value, ['isNotEmpty'])
                console.log(nameResult);
                //return in end
                return {
                    ...state,
                    fullName: {
                        ...state.fullName,
                        ok: nameResult.ok,
                        helperText: nameResult.message
                    }
                }
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
            case "validatePassword":
                //..
                let passwordResult = formVerification(state.password.value, ['isNotEmpty', 'hasNoSpace', 'hasUpperCase'])
                return {
                    ...state,
                    password: {
                        ...state.password,
                        ok: passwordResult.ok,
                        helperText: passwordResult.message
                    }
                }
            case "validateConfirmPassword":
                //..
                if (state.confirmPassword.value == state.password.value) {
                    return {
                        ...state,
                        confirmPassword: {
                            ...state.confirmPassword,
                            ok: true
                        }
                    }
                }
                return {
                    ...state,
                    confirmPassword: {
                        ...state.confirmPassword,
                        ok: false,
                        helperText: "Confirm Password and Password Don't Match."
                    }
                }

            case "updateFullName":
                console.log(action)
                return {
                    ...state,
                    fullName: {
                        ...state.fullName,
                        value: action.value
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
            case "updateConfirmPassword":
                return {
                    ...state,
                    confirmPassword: {
                        ...state.confirmPassword,
                        value: action.value
                    }
                }

        }

    }
    const [signupFormData, signupFormDispatch] = useReducer(signupFormReducer, {
        fullName: {
            value: '',
            ok: true,
            helperText: ''
        },
        email: {
            value: '',
            ok: true,
            helperText: ''
        },
        password: {
            value: '',
            ok: true,
            helperText: ''
        },
        confirmPassword: {
            value: '',
            ok: true,
            helperText: ''
        },

    })

    useEffect(() => {
        let errCheck = true;
        for (const key in signupFormData) {
            if (!(signupFormData[key].value != '' && signupFormData[key].ok == true)) {
                errCheck = false
                break;
            }
        }
        setCanSignup(errCheck)
    }, [signupFormData])



    return (
        <>
            <Grid container justifyContent="center" alignItems="start" py={15} sx={{
                height: 'auto'
            }} >
                <Grid
                    xs={11} md={6} lg={4} sx={{
                        px: {
                            xs: 2,
                            md: 7
                        },
                        py: {
                            xs: 4,
                            md: 7
                        }
                    }}
                    className={formContainerStyles.container + ' ' + formContainerStyles.transparentBackground + ' ' + (inMobile ? formContainerStyles.shadowMobile : formContainerStyles.shadow)}>
                    <Grid mb={1}>
                        <Typography variant="h3"
                            textAlign='center'>
                            Sign Up
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
                                bgcolor: colors.darkMud,
                                height: '1px',
                                opacity: '0.4'
                            }} />
                        </Grid>

                    </Grid>

                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <AccountCircle sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} />
                            <ThemeProvider theme={theme}>
                                <TextField
                                    //size='medium'
                                    sx={{
                                        ".MuiInputBase-input": {
                                            fontSize: "1.17rem",
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem",
                                        },
                                    }}
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updateFullName',
                                            value: e.target.value
                                        }
                                        signupFormDispatch(action);
                                        action = {
                                            type: 'validateFullName',
                                            value: null
                                        }
                                        signupFormDispatch(action);

                                    }}
                                    onBlur={(e) => {
                                        let action = {
                                            type: 'validateFullName',
                                            value: null
                                        }
                                        signupFormDispatch(action);

                                    }}
                                    color='primary'
                                    error={!signupFormData.fullName.ok}
                                    helperText={signupFormData.fullName.helperText}
                                    fullWidth id="input-with-sx" label="Full Name" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>

                    <Grid mb={2}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <EmailIcon sx={{ color: colors.darkMud, mr: 1, my: 0.5 }} />
                            <ThemeProvider theme={theme}>
                                <TextField
                                    //size='medium'
                                    sx={{
                                        ".MuiInputBase-input": {
                                            fontSize: "1.17rem",
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem",
                                        },
                                    }}

                                    color='primary'
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updateEmail',
                                            value: e.target.value
                                        }
                                        signupFormDispatch(action);
                                        let action2 = {
                                            type: 'validateEmail',
                                            value: null
                                        }
                                        signupFormDispatch(action2)

                                    }}
                                    onBlur={(e) => {
                                        let action = {
                                            type: 'validateEmail',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                    }}
                                    error={!signupFormData.email.ok}
                                    helperText={signupFormData.email.helperText}
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
                                            fontSize: "1.17rem",
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem",
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
                                    error={!signupFormData.password.ok}
                                    helperText={signupFormData.password.helperText}
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updatePassword',
                                            value: e.target.value
                                        }
                                        signupFormDispatch(action)
                                        action = {
                                            type: 'validatePassword',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                        action = {
                                            type: 'validateConfirmPassword',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                    }}
                                    onBlur={() => {
                                        let action = {
                                            type: 'validatePassword',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                        action = {
                                            type: 'validateConfirmPassword',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                    }}
                                    color='primary'
                                    fullWidth id="input-with-sx" label="Password" variant="standard" />
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
                                            fontSize: "1.17rem",
                                        },

                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: "1.1rem",
                                        },
                                    }}
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            < InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle confirm password visibility"
                                                    onClick={toggleConfirmPassword}
                                                    //onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {confirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    color='primary'
                                    error={!signupFormData.confirmPassword.ok}
                                    helperText={signupFormData.confirmPassword.helperText}
                                    onChange={(e) => {
                                        let action = {
                                            type: 'updateConfirmPassword',
                                            value: e.target.value
                                        }
                                        signupFormDispatch(action)
                                        action = {
                                            type: 'validateConfirmPassword',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                    }}
                                    onBlur={() => {
                                        let action = {
                                            type: 'validateConfirmPassword',
                                            value: null
                                        }
                                        signupFormDispatch(action)
                                    }}
                                    fullWidth id="input-with-sx" label="Confirm Password" variant="standard" />
                            </ThemeProvider>

                        </Box>

                    </Grid>

                    <Grid pl={1} pt={2}>

                        <ThemeProvider theme={theme}>
                            <Button disabled={!canSignup} onClick={signupHandler} color={'primary'} variant='contained' size='large' fullWidth >
                                Sign Up
                            </Button>
                        </ThemeProvider>

                    </Grid>

                    <Grid mt={2} textAlign={'center'} fontSize={'1em'}>
                        <span>Already has an account? </span><Link
                            style={{
                                textDecoration: 'none',
                            }}
                            to={'/sign-in'} ><span style={{ color: '#316FF6' }}>Sign In</span></Link>
                    </Grid>

                </Grid>
            </Grid>
        </>
    )
}

export default SignupForm;