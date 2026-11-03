import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, Card, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { registerUserAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function RegisterForm() {
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const submit = async data => {
    setError('')
    try {
      const result = await registerUserAPI(data)
      setRegistered(result.requiresConfirmation)
    } catch (err) { setError(err.message || 'Registration failed.') }
  }
  return (
    <Card component='form' onSubmit={handleSubmit(submit)} sx={{ p: 3, mt: 8, width: 'min(400px, 92vw)' }}>
      <Typography variant='h5' gutterBottom>Create account</Typography>
      {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
      {registered && <Alert severity='info' sx={{ mb: 2 }}>If registration is eligible, a confirmation email will arrive. Check your inbox, then sign in.</Alert>}
      <TextField autoFocus fullWidth label='Email' type='email' autoComplete='email' {...register('email', { required: 'Email is required.' })} error={!!errors.email} />
      <FieldErrorAlert errors={errors} fieldName='email' />
      <TextField fullWidth sx={{ mt: 2 }} label='Password' type='password' autoComplete='new-password' {...register('password', { required: 'Password is required.', minLength: { value: 8, message: 'Use at least 8 characters.' } })} error={!!errors.password} />
      <FieldErrorAlert errors={errors} fieldName='password' />
      <TextField fullWidth sx={{ mt: 2 }} label='Confirm password' type='password' autoComplete='new-password' {...register('confirmation', { validate: value => value === watch('password') || 'Passwords do not match.' })} error={!!errors.confirmation} />
      <FieldErrorAlert errors={errors} fieldName='confirmation' />
      <Button fullWidth type='submit' variant='contained' disabled={isSubmitting} sx={{ my: 2 }}>{isSubmitting ? 'Registering...' : 'Register'}</Button>
      <Box sx={{ textAlign: 'center' }}><Link to='/login'>Back to login</Link></Box>
    </Card>
  )
}
export default RegisterForm
