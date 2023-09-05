import { Button, ButtonGroup, ButtonProps, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, styled } from "@mui/material"
import { useStore } from "../Store/Store"
import { useCallback, useState } from "react";
import fileDownload from "js-file-download";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import green from "@mui/material/colors/green";

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(green[700]),
  backgroundColor: green[700],
  '&:hover': {
    backgroundColor: green[900],
  },
  height: '40px',
  borderRadius: 'inherit',
}));

export default function Toolbar() {
  const [imageList, setStore] = useStore(store => store.imageList);
  const [gridSize, setGridSize] = useState(3);
  const [cellRes, setCellRes] = useState(300);

  const handleCellRes = useCallback((num: number) => {
    setCellRes(num);
  }, [setCellRes]);

  const handleGridSize = useCallback((num: number) => {
    setGridSize(num);
    setStore(prev => {
      const newStore = { ...prev };
      const len = newStore.imageList.length;
      newStore.imageList.length = num ** 2;
      for (let i = len; i < num ** 2; i++)
        newStore.imageList[i] = { base64: '', title: '' };
      newStore.imageList = [...newStore.imageList];
      return newStore;
    })
  }, [setGridSize, setStore])

  const download = useCallback(() => {
    const imagePromises = imageList.map(src => {
      if (src.base64 === '') {
        return Promise.resolve(null);
      }
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.crossOrigin = 'anonymous';
        img.src = src.base64;
      });
    });

    Promise.all(imagePromises).then(images => {
      const canvas = document.createElement('canvas');
      canvas.width = gridSize * cellRes;
      canvas.height = gridSize * cellRes;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Can not create context');
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const img = images[y * gridSize + x];
          if (img === null)
            continue;
          context.drawImage(img, 0, 0, img.width, img.height, x * cellRes, y * cellRes, cellRes, cellRes);
        }
      }

      canvas.toBlob(blob => {
        if (blob === null)
          return;
        fileDownload(blob, 'test3x3.png');
      });
    });
  }, [imageList, gridSize, cellRes])

  return (
    <ButtonGroup variant="contained" sx={{ mt: '1rem' }}>
      <StyledButton onClick={download} >
        <FileDownloadOutlinedIcon />
        Download
      </StyledButton>
      <DropdownButton title={`${gridSize}x${gridSize}`} sx={{ textTransform: 'none' }}>
        {['3x3', '4x4', '5x5'].map((e, i) =>
          <MenuItem key={i} onClick={() => handleGridSize(i + 3)} sx={{ px: 3.25 }}>
            {e}
          </MenuItem>
        )}
      </DropdownButton>
      <DropdownButton title={`${cellRes}px`} sx={{ textTransform: 'none', borderRadius: 'inherit' }}>
        {['200px', '300px', '400px', '500px'].map((e, i) =>
          <MenuItem key={i} onClick={() => handleCellRes((i + 2) * 100)} sx={{ px: 3.25 }}>
            {e}
          </MenuItem>
        )}
      </DropdownButton>

    </ButtonGroup>
  )
}

function DropdownButton({ title, children, ...props }: Omit<ButtonProps, 'title'> & { title: React.ReactNode }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  }, [setAnchorEl]);

  const closePopper = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <>
      <Button {...props} endIcon={<KeyboardArrowDown />} onClick={handleClick} aria-describedby="popper-menu" >
        {title}
      </Button>
      <Popper open={open} onClick={closePopper} anchorEl={anchorEl} id='popper-menu' transition placement="bottom">
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'top' : 'bottom' }} >
            <Paper sx={{ py: '1px', overflow: 'auto', backgroundImage: 'linear-gradient: rgba(128, 128, 128, 0.2)' }}>
              <ClickAwayListener onClickAway={closePopper}>
                <MenuList aria-labelledby="popper-menu" >
                  {children}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
