import { Box, Grid } from '@mui/material';
import DebounceText from './Components/DebounceText';
import ThemeSwitcher from './Theme/ThemeSwitcher';
import ImageResults from './Components/ImageResults';
import ImageGrid from './Components/ImageGrid';
import DarkTheme from './Theme/DarkTheme';
import Toolbar from './Components/Toolbar';
import Tabbar from './Components/Tabbar';

function App() {

  return (
    <DarkTheme>
      <Box className='bg' display='flex' alignItems='flex-start' justifyContent='center' sx={{ py: 1, minWidth: '22rem', px: '1rem', minHeight: '100vh', position: 'relative' }}>
        <ThemeSwitcher />
        <Grid className='bg' container gap={2} sx={{ maxWidth: '56rem', justifyContent: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Tabbar />
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <DebounceText />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <ImageResults />
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <ImageGrid />
            <Toolbar />
          </Grid>
        </Grid>
      </Box>
    </DarkTheme>
  )
}

export default App;
