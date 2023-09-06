import { useCallback, useEffect } from 'react'
import { Button, Grid, Box, IconButton } from '@mui/material';
import CenterFocusWeakTwoToneIcon from '@mui/icons-material/CenterFocusWeakTwoTone';
import AddIcon from '@mui/icons-material/Add';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useStore } from '../Store/Store';
import { styled } from '@mui/material/styles';

const BorderedGrid = styled(Grid)(({ theme }) => ({
  outline: theme.palette.mode === 'dark' ? '1px solid #ffffff20' : '1px solid #00000020',
  outlineOffset: '-1px',
}));

export default function ImageGrid() {
  const [selectedCell, setStore] = useStore(store => store.selectedCell);
  const [imageList] = useStore(store => store.imageList);

  const handleButtonClick = useCallback((i: number) => {
    setStore(prev => {
      let newStore = { ...prev };
      const newCell = prev.selectedCell == i ? NaN : i;
      newStore.disableTextField = Number.isNaN(newCell);
      newStore.selectedCell = newCell;
      newStore.selectedImage = NaN;
      return newStore;
    });
  }, [setStore]);

  const clearCell = useCallback(() => {
    setStore(prev => {
      const newStore = { ...prev };
      newStore.imageList = [...newStore.imageList];
      newStore.imageList[selectedCell] = { base64: '', title: '' };
      newStore.selectedImage = NaN;
      return newStore;
    })
  }, [setStore, selectedCell])

  useEffect(() => {
    function exit(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.classList.contains('bg')) {
        setStore({ ['selectedCell']: NaN, ['disableTextField']: true });
      }
    }
    window.addEventListener('click', exit);
    return () => {
      window.removeEventListener('click', exit);
    }
  }, []);

  return (
    <Box >
      <BorderedGrid container sx={{ p: '1px' }} spacing={0}>
        {imageList.map((e, i) => (
          <BorderedGrid item key={i} xs={12 / Math.sqrt(imageList.length)} sx={{ aspectRatio: '1/1', position: 'relative' }}>
            {
              e.base64 !== '' && selectedCell === i && <IconButton color='error' onClick={clearCell} sx={{
                cursor: 'pointer',
                zIndex: 1, p: 0,
                position: 'absolute',
                top: 6, right: 6,
                width: '20%', height: '20%',
                border: '1px solid', borderRadius: '10%',
                bgcolor: 'rgba(0, 0, 0, 0.4)'
              }} >
                <ClearRoundedIcon sx={{ height: '100%', width: '100%' }} />
              </IconButton>
            }
            <Button onClick={() => handleButtonClick(i)} sx={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              p: selectedCell === i ? 0.5 : 0,
              backgroundColor: selectedCell === i ? 'rgba(48, 122, 195, 0.1)' : 'transparent',
              border: selectedCell === i ? '2px dashed #307ac3' : '',
            }}>
              {
                e.base64 !== '' ? <img src={e.base64} title={e.title} /> : (selectedCell === i ?
                  <CenterFocusWeakTwoToneIcon sx={{ width: '30%', height: '30%' }} /> :
                  <AddIcon sx={{ width: '25%', height: '25%' }} />
                )
              }
            </Button>
          </BorderedGrid>
        ))}
      </BorderedGrid>
    </Box>
  )
}