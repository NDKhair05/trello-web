import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'

function App() {

  return (
    <Routes>
      {/*Redirect Route*/}
      <Route path='/' element= {
        <Navigate to = "/boards/6896e71dbc96537aa7507104" replace = {true}/>
      } />

      {/*Board Details*/}
      <Route path='/boards/:boardId' element={ <Board />} />

      {/*Auth*/}
      <Route path='/login' element={ <Auth />} />
      <Route path='/register' element={ <Auth />} />

      {/*404 not found page*/}
      <Route path='*' element={ <NotFound />} />
    </Routes>
  )
}

export default App
