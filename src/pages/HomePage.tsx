import { Link } from 'react-router-dom'
import { Button, Typography, Container, Box } from '@mui/material'
import BreadcrumbsNav from '../components/BreadcrumbsNav'
import { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const { setSelectedType, setSelectedScheme, setSelectedVariant } = useContext(AppContext);
  
  // Reset při načtení této stránky
  useEffect(() => {
    setSelectedType(null);
    setSelectedScheme(null);
    setSelectedVariant(null);
  }, [setSelectedType, setSelectedScheme, setSelectedVariant]);

  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <BreadcrumbsNav />
      <Typography variant="h3" gutterBottom>
        Vítejte ve výukové aplikaci
      </Typography>
      <Box sx={{ 
        mt: 4,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        flexDirection: 'row'  
      }} >
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
      </Box>
    </Container>
  )
}

export default Home