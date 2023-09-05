import { useState, useCallback, useEffect, useRef } from 'react'
import { Box, IconButton, InputAdornment, TextField, LinearProgress } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useStore } from '../Store/Store';
import useApi from '../API/api';

export type media = {
  id: string,
  type: string,
  coverImage: {
    extraLarge?: string,
  },
  title: {
    english?: string,
    romaji?: string
  },
  season?: string,
  seasonYear?: number,
  status?: string,
  episodes?: number,
  nextAiringEpisode?: {
    airingAt?: number,
    timeUntilAiring?: number,
    episode?: number,
  }
}

export type fetchResult = {
  data?: {
    Page: {
      media: media[]
    }
  }
}

export default function DebounceText() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setStore] = useStore(store => store.disableTextField);
  const [selectedCell] = useStore(store => store.selectedCell);
  const search = useApi();
  const textFieldRef = useRef<HTMLInputElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const APIFetch = useCallback((value: string) => {
    if (value === '') {
      setStore({ ['fetchResult']: {} });
      return;
    }
    setLoading(true);
    search(value).then((data: fetchResult) => {
      setStore({ ['fetchResult']: { ...data } });
      setLoading(false);
      console.log(`Search for: ${value}\nfetched!`, data);
    }).catch(error => {
      setLoading(false);
      alert("Error: see console");
      console.log(error);
    });

  }, [setStore, search]);

  useEffect(() => {
    APIFetch(text);
  }, [search]);

  const handleText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      APIFetch(newValue);
      timer.current = null;
    }, 750);

    setText(newValue);
  }, [setText, timer.current, APIFetch]);

  const handleSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter")
      return;
    if (timer.current) {
      APIFetch(text);
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, [text, APIFetch, timer.current]);

  const clearTextField = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setLoading(false);
    setText('');
    APIFetch('');
  }, [setText, APIFetch, timer.current])

  useEffect(() => {
    if (Number.isNaN(selectedCell)) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    } else {
      textFieldRef.current?.focus();
      textFieldRef.current?.select();
    }
  }, [selectedCell]);

  return (
    <Box>
      <TextField value={disabled ? '' : text} onChange={handleText} onKeyDown={handleSubmit}
        inputRef={textFieldRef}
        disabled={disabled}
        placeholder='Search Anime...'
        size="small"
        autoComplete='off'
        sx={{ width: '100%', opacity: disabled ? 0.5 : 1, transition: 'opacity 250ms ease-in-out' }}
        InputProps={{
          spellCheck: 'false', sx: { paddingRight: 0 },
          endAdornment: text !== '' && <InputAdornment position="end">
            <IconButton onClick={clearTextField}>
              <ClearRoundedIcon />
            </IconButton>
          </InputAdornment>,
          startAdornment: <InputAdornment position='start'>
            {disabled ? <SearchOffRoundedIcon sx={{ opacity: 0.6 }} /> : <SearchIcon sx={{ opacity: 0.7 }} />}
          </InputAdornment>
        }}
      />
      {loading && <LinearProgress />}
    </Box>
  )
}
