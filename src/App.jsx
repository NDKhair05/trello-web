import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {

  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/*Redirect Route*/}
      <Route path='/' element= {
        <Navigate to = "/boards/6896e71dbc96537aa7507104" replace = {true}/>
      } />

      <Route element={ <ProtectedRoute user={currentUser} /> } >
        {/*Board Details*/}
        <Route path='/boards/:boardId' element={ <Board />} />
      </Route>
      {/*Auth*/}
      <Route path='/login' element={ <Auth />} />
      <Route path='/register' element={ <Auth />} />

      {/*404 not found page*/}
      <Route path='*' element={ <NotFound />} />

      {/*Account Verification page*/}
      <Route path='account/verification' element={ <AccountVerification />} />
    </Routes>
  )
}

export default App
