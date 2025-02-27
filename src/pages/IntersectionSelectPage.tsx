import { useNavigate } from 'react-router-dom'
import { Button, Typography, Box } from '@mui/material'

export default function IntersectionSelectPage() {
  const navigate = useNavigate()

  const handleTypeSelect = (type: 'T' | 'X') => {
    navigate(`/select-scheme/${type}`)
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Výběr křižovatky
      </Typography>
      <Typography variant="h6" gutterBottom>
        Vyberte typ křižovatky
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 2,
          flexWrap: 'wrap'
        }}
      >
        <Button 
          variant="outlined" 
          onClick={() => handleTypeSelect('T')}
          sx={{ flexDirection: 'column', p: 2 }}
        >
          <img
            src="src/imgs/T-type.jpg"
            alt="Křižovatka typu T"
            style={{ width: '200px' }}
          />
          <Typography variant="button" sx={{mt: 1}}>Typ T</Typography>
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => handleTypeSelect('X')}
          sx={{ flexDirection: 'column', p: 2 }}
        >
          <img
            src="src/imgs/X-type.jpg"
            alt="Křižovatka typu X"
            style={{ width: '200px' }}
          />
          <Typography variant="button" sx={{mt: 1}}>Typ X</Typography>
        </Button>
      </Box>
    </Box>
  )
}