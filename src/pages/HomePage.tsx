import { Link } from 'react-router-dom'
import { Button, Typography, Container } from '@mui/material'

const Home = () => {
  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Intersection Visualization App
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/select-intersection"
        size="large"
      >
        Vyberte křižovatku
      </Button>
      <Button
          variant="outlined"
          component={Link}
          to="/tutorial"
          size="large"
        >
          Tutoriál
        </Button>
    </Container>
  )
}

export default Home