import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'

//Config MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

//Config Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

//Config Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

//Xử lí kỹ thuật inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from '~/utils/authorizeAxios'
import { GlobalStyles } from '@mui/material'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} >
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme} >
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            cancellationButtonProps: { color:'inherit' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            buttonOrder: ['confirm', 'cancel']
          }}>
            <GlobalStyles styles = { { a: { textDecoration: 'none' } } } />
            <CssBaseline />
            <App />
            <ToastContainer position = "bottom-left" theme = 'colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
