export default async function jikanAPI(search: string) {
  let url = `https://api.jikan.moe/v4/anime?limit=10&sfw=true&q=${encodeURIComponent(search)}`,
    options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }

  return fetch(url, options)
    .then(async response => {
      return response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
      });
    })
    .then(data => {
      console.log(data);
      return {
        data: {
          Page: {
            media: data.data.map((e: any) => {
              return {
                id: e.mal_id,
                type: e.type,
                coverImage: {
                  extraLarge: e.images.jpg.large_image_url,
                },
                title: {
                  english: e.title_english,
                  romaji: e.title
                },
                season: e.season,
                seasonYear: e.year,
                status: e.status,
                episodes: e.episodes
              }
            })
          }
        }
      }
    });
}
