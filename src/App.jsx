import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Button, Container, Typography } from '@mui/material'
import Board from '~/pages/Boards/_id'
import Boards from '~/pages/Boards'
import Auth from '~/pages/Auth/Auth'
import NotFound from '~/pages/404/NotFound'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { isSupabaseConfigured, supabase } from '~/lib/supabase'
import { mapUser } from '~/apis/mappers'
import { sessionChanged, sessionFailed } from '~/redux/user/userSlice'

const ProtectedRoute = ({ user }) => user ? <Outlet /> : <Navigate to='/login' replace />

function App() {
  const dispatch = useDispatch()
  const { currentUser, initialized, error } = useSelector(state => state.user)
  useEffect(() => {
    if (!supabase) return
    // INITIAL_SESSION also restores the session after F5 and email confirmation.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(sessionChanged(mapUser(session?.user)))
    })
    supabase.auth.getSession().then(({ error: sessionError }) => {
      if (sessionError) dispatch(sessionFailed(sessionError.message))
    }).catch(err => dispatch(sessionFailed(err.message)))
    return () => data.subscription.unsubscribe()
  }, [dispatch])

  if (!isSupabaseConfigured) return (
    <Container maxWidth='sm' sx={{ py: 8 }}>
      <Typography variant='h4' gutterBottom>Trello Cloud — MVP</Typography>
      <Alert severity='info'>Chưa cấu hình Supabase. Sao chép .env.example thành .env.local, điền VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY, sau đó khởi động lại ứng dụng.</Alert>
      <Typography sx={{ mt: 2 }}>Hướng dẫn đầy đủ: docs/deployment.md trong mã nguồn.</Typography>
    </Container>
  )
  if (error) return <Box sx={{ p: 4 }}><Alert severity='error'>{error}</Alert><Button onClick={() => window.location.reload()}>Retry</Button></Box>
  if (!initialized) return <PageLoadingSpinner caption='Restoring your session...' />
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/boards' replace />} />
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/boards' element={<Boards />} />
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/auth/callback' element={currentUser ? <Navigate to='/boards' replace /> : <Container sx={{ py: 8 }}><Alert severity='info'>Confirmation completed or link expired. Please sign in; request a new confirmation by registering again if needed.</Alert><Button component={Link} to='/login'>Go to login</Button></Container>} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
export default App
