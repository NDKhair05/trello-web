import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { CssBaseline, GlobalStyles } from '@mui/material'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{ confirmationButtonProps: { color: 'primary' }, buttonOrder: ['confirm', 'cancel'] }}>
          <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
          <CssBaseline />
          <App />
          <ToastContainer position='bottom-left' theme='colored' />
        </ConfirmProvider>
      </CssVarsProvider>
    </BrowserRouter>
  </Provider>
)
