import React, { useCallback, useEffect, useState } from 'react';
import { Card, Box } from '@mui/material';
import ReactCrop, { Crop, PercentCrop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useStore } from '../Store/Store';
import { media } from './DebounceText';

export default function ImageResults() {
  const [fetchResult] = useStore(store => store.fetchResult);
  const [selectedImage, setStore] = useStore(store => store.selectedImage);
  const [selectedCell] = useStore(store => store.selectedCell);
  const AnimeDetails = fetchResult.data?.Page.media;

  const handleClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const id = Number((e.target as HTMLImageElement).dataset.id);
    setStore({ ['selectedImage']: id });
  }, [setStore]);

  useEffect(() => {
    setStore({ ['selectedImage']: NaN });
  }, [fetchResult]);

  return (
    <Box
      className='auto-height'
      sx={{
        display: 'inline-grid',
        gridTemplateRows: !Number.isNaN(selectedCell) && AnimeDetails ? '1fr' : '0fr',
      }}
    >
      <Card
        className='img-wrapper'
        sx={{
          overflow: 'auto hidden',
          display: 'flex',
          alignItems: 'center',
          pr: !Number.isNaN(selectedCell) && AnimeDetails ? '1rem' : '0',
          borderWidth: !Number.isNaN(selectedCell) && AnimeDetails ? '1px' : '0',
        }}
      >
        <div></div>
        {!Number.isNaN(selectedCell) && AnimeDetails?.map((e, i) => {
          const title = getTitle(e);
          return <Box key={i} sx={{ height: '100%' }}>
            {selectedImage !== i ? <img
              onClick={handleClick} data-id={i}
              src={e.coverImage.extraLarge}
              alt={e.title.romaji || e.title.english || '???'}
              title={title}
            /> : <ImageCropper imageMedia={e} title={title} id={i} />
            }
          </Box>
        })}
      </Card>
    </Box>
  )
}

function ImageCropper({ imageMedia, title, id }: { imageMedia: media, title: string, id: number }) {
  const [crop, setCrop] = useState<Crop>();
  const [selectedCell, setStore] = useStore(store => store.selectedCell);

  const handleCropChange = useCallback((pixelCrop: PixelCrop) => {
    setCrop(pixelCrop);
  }, []);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }, [setCrop, centerAspectCrop]);

  const handleComplete = useCallback((_pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    const { x, y, width, height } = percentCrop;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * img.width / 100;
      canvas.height = height * img.height / 100;
      const context = canvas.getContext('2d');
      context?.drawImage(img, x * img.width / 100, y * img.height / 100, width * img.width / 100, height * img.height / 100, 0, 0, width * img.width / 100, height * img.height / 100);
      document.getElementById('root')?.appendChild(canvas);
      const base64data = canvas.toDataURL('image/png');
      canvas.remove();
      setStore(prev => {
        let newStore = { ...prev };
        const newImageList = [...prev.imageList];
        newImageList[selectedCell].base64 = base64data;
        newImageList[selectedCell].title = title;
        newStore.imageList = [...newImageList];
        return newStore;
      });
      img.remove();
    };
    img.crossOrigin = 'anonymous';
    img.src = imageMedia.coverImage.extraLarge + '?x=' + id;
  }, [setStore, selectedCell]);

  return (
    <ReactCrop
      crop={crop}
      onChange={handleCropChange}
      onComplete={handleComplete}
      aspect={1}
      keepSelection={true}
      minHeight={50} minWidth={50}
    >
      <img
        src={imageMedia.coverImage.extraLarge}
        alt={imageMedia.title.romaji || imageMedia.title.english || '???'}
        title={getTitle(imageMedia)}
        onLoad={onImageLoad}
      />
    </ReactCrop>
  );
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      mediaWidth < mediaHeight ? {
        unit: '%',
        width: 100,
      } : {
        unit: '%',
        height: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

function getTitle(e: media) {
  let title = e.title.english ? e.title.english + '\n' : '';
  title += e.title.romaji && e.title.romaji !== e.title.english ? e.title.romaji + '\n' : '';
  title += e.status && `Status: ${e.status[0].toUpperCase() + e.status.slice(1).replace(/_/g, ' ').toLowerCase()}\n` || '';
  title += e.season ? `Season: ${e.season[0].toUpperCase() + e.season.slice(1).toLowerCase()} ${e.seasonYear ?? ''}\n` : (e.seasonYear ? `Year: ${e.seasonYear}\n` : '');
  title += e.episodes && `Episode${e.status == 'RELEASING' || e.status == 'HIATUS' ? `: ${e.nextAiringEpisode?.episode ?? ''} / ${e.episodes}` : `s: ${e.episodes}`}`;
  title += e.status == 'RELEASING' ? `\nNext episode: ${secondsToDays(e.nextAiringEpisode?.timeUntilAiring ?? NaN)}` : '';
  return title;
}

function secondsToDays(time: number) {
  if (Number.isNaN(time))
    return '-';
  let days: number | string = Math.floor(time / 60 / 60 / 24);
  time -= days * 60 * 60 * 24;
  days = days <= 0 ? '' : `${days}d `;
  let hours: number | string = Math.floor(time / 60 / 60);
  time -= hours * 60 * 60;
  hours = hours <= 0 ? '' : `${hours}h `;
  let minutes: number | string = Math.round(time / 60);
  minutes = minutes <= 0 ? '' : `${minutes}m`;
  return `${days}${hours}${minutes}`;
}
