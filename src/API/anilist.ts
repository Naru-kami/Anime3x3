
export default async function anilistAPI(search: string) {
  let query = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
      media (search: $search, type: ANIME, isAdult: false) {
        id
        type
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
        }
        season
        seasonYear
        status
        episodes
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
  `;
  let variables = {
    search: search,
    page: 1,
    perPage: 15
  };
  let url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    };

  return fetch(url, options)
    .then(async response => {
      return response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
      });
    });
} 