import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, Card, CardActionArea, CardContent, Container, Grid, Pagination, TextField, Typography } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import CreateBoard from './create'
import { fetchBoardsAPI } from '~/apis'

function Boards() {
  const [boards, setBoards] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const refresh = useCallback(() => { setPage(1); setRevision(value => value + 1) }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchBoardsAPI(new URLSearchParams({ page: String(page), title: filter }).toString())
      .then(result => { if (active) { setBoards(result.boards); setTotal(result.totalBoards) } })
      .catch(err => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page, filter, revision])
  return <>
    <AppBar />
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box><Typography variant='h4' fontWeight='bold'>Your boards</Typography><Typography color='text.secondary'>Private boards for your personal work.</Typography></Box>
        <CreateBoard afterCreatedNewBoard={refresh} />
      </Box>
      <Box component='form' onSubmit={event => { event.preventDefault(); setPage(1); setFilter(search.trim()) }} sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField size='small' label='Search boards' value={search} onChange={event => setSearch(event.target.value)} />
        <Button type='submit' variant='outlined'>Search</Button>
      </Box>
      {error ? <Alert severity='error' action={<Button onClick={refresh}>Retry</Button>}>{error}</Alert> : loading ? <PageLoadingSpinner caption='Loading boards...' /> : <>
        {!boards.length && <Alert severity='info'>No boards found. Create a board to get started.</Alert>}
        <Grid container spacing={2}>{boards.map(board => <Grid item xs={12} sm={6} md={4} key={board._id}>
          <Card><CardActionArea component={Link} to={`/boards/${board._id}`}>
            <Box sx={{ height: 90, bgcolor: 'primary.dark', backgroundImage: board.theme.type === 'gradient' ? board.theme.value.replace(/;$/, '') : 'none' }} />
            <CardContent><Typography variant='h6'>{board.title}</Typography><Typography color='text.secondary' sx={{ overflowWrap: 'anywhere' }}>{board.description}</Typography></CardContent>
          </CardActionArea></Card>
        </Grid>)}</Grid>
        {total > 12 && <Pagination sx={{ mt: 3 }} page={page} count={Math.ceil(total / 12)} onChange={(_event, value) => setPage(value)} />}
      </>}
    </Container>
  </>
}
export default Boards
