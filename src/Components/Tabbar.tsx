import { Tabs, Tab } from '@mui/material';
import { useStore } from '../Store/Store'
import { useCallback } from 'react';

export default function Tabbar() {
  const [tab, setTab] = useStore(store => store.api);
  const handleTab = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTab({ ['api']: newValue });
  }, [setTab]);

  return (
    <Tabs value={tab} onChange={handleTab} centered sx={{ minHeight: '2rem' }}>
      <Tab label='Anilist' sx={{ minHeight: '2rem', py: 0, borderBottom: '2px solid rgba(128, 128, 128, 0.4)' }} />
      <Tab label='Jikan' sx={{ minHeight: '2rem', py: 0, borderBottom: '2px solid rgba(128, 128, 128, 0.4)' }} />
    </Tabs>
  )
}
