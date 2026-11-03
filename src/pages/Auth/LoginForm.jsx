import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, Card, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function LoginForm() {
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const submit = async data => {
    setError('')
    try { await dispatch(loginUserAPI(data)).unwrap() }
    catch (err) { setError(err.message || 'Login failed.') }
  }
  return (
    <Card component='form' onSubmit={handleSubmit(submit)} sx={{ p: 3, mt: 8, width: 'min(400px, 92vw)' }}>
      <Typography variant='h5' gutterBottom>Trello Cloud</Typography>
      <Typography color='text.secondary' sx={{ mb: 2 }}>Log in to manage your personal boards.</Typography>
      {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
      <TextField autoFocus fullWidth label='Email' type='email' autoComplete='email' error={!!errors.email} {...register('email', { required: 'Email is required.' })} />
      <FieldErrorAlert errors={errors} fieldName='email' />
      <TextField fullWidth sx={{ mt: 2 }} label='Password' type='password' autoComplete='current-password' error={!!errors.password} {...register('password', { required: 'Password is required.' })} />
      <FieldErrorAlert errors={errors} fieldName='password' />
      <Button fullWidth type='submit' variant='contained' disabled={isSubmitting} sx={{ my: 2 }}>{isSubmitting ? 'Logging in...' : 'Login'}</Button>
      <Box sx={{ textAlign: 'center' }}><Link to='/register'>Create account</Link></Box>
    </Card>
  )
}
export default LoginForm
