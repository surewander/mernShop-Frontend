import { useReducer, createContext, useEffect } from "react";


const GlobalContext = createContext()

function GlobalWrapper(props) {


  const globalReducer = (state, action) => {
    switch (action.type) {
      case 'createAlert':
        state = {
          ...state,
          alertData: {
            type: action.value.alertType,
            message: action.value.message,
            isVisible: true
          }
        }
        return state;
      case 'closeAlert':
        state = {
          ...state,
          alertData: {
            type: '',
            message: '',
            isVisible: false
          }
        }
        return state;
      case 'signIn':
        state = {
          ...state,
          userData: {
            id: action.value.id,
            email: action.value.email,
            token: action.value.token
          },
          cartCount: action.cartCount
        }
        return state;
      case 'signOut':
        state = {
          ...state,
          userData: {
            ...action.value
          },
          cartCount: 0
        }
        return state;
      case 'updateCartCount':
        state = {
          ...state,
          cartCount: action.value
        }
        return state
      case 'showLoader':
        state = {
          ...state,
          loaderData: {
            open: true,
          }
        }
        return state;
      case 'hideLoader':
        state = {
          ...state,
          loaderData: {
            open: false
          }
        }
        return state;
    }
  }

  const [globalData, globalDataDispatch] = useReducer(globalReducer, {
    alertData: {
      type: '',
      message: '',
      isVisible: false
    },
    userData: {
      id: -1,
      email: '',
      token: ''
    },
    loaderData: {
      open: false,
    },
    cartCount: 0
  })

  useEffect(() => {
    // for reload retain sign in values
    if (localStorage.getItem('userData')) {
      globalDataDispatch(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  return (
    <GlobalContext.Provider value={{ globalData, globalDataDispatch }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
export { GlobalContext }
export default GlobalWrapper;
