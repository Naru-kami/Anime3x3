import { useCallback } from 'react'
import { useStore } from "../Store/Store";
import anilist from "./anilist";
import jikan from './jikan';

export default function useApi() {
  const [selectedApi] = useStore(store => store.api);

  const search = useCallback((searchTerm: string) => {
    switch (selectedApi) {
      case 0:
        return anilist(searchTerm);
      case 1:
        return jikan(searchTerm);
      default:
        throw new Error(`Unsupported API: ${selectedApi}`);
    }
  }, [selectedApi])

  return search;
}