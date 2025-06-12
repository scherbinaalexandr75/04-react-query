import axios from 'axios';
import type { MovieApiResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const TOKEN = import.meta.env.VITE_API_KEY;

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieApiResponse> => {
  try {
    console.log('TMDB Token:', TOKEN);
    const response = await axios.get<MovieApiResponse>(BASE_URL, {
      params: { query, page },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    

    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies from TMDB API.');
  }
};
