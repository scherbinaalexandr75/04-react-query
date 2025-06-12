import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ReactPaginate from 'react-paginate';
import { fetchMovies } from '../../services/movieService';
import type { Movie, MovieApiResponse } from '../../types/movie';
import styles from './App.module.css';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isError, isSuccess } = useQuery<
    MovieApiResponse,
    Error
  >({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query.trim(),
    placeholderData: (prev: MovieApiResponse | undefined) => prev,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast('No movies found for your search query.');
    }
  }, [isSuccess, data]);

  const handleSearch = (query: string): void => {
    if (!query.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    setQuery(query);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelect = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = (): void => {
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setPage(selected + 1);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isPending && query.trim() !== '' && <Loader />}
      {isError && <ErrorMessage message="Failed to fetch movies." />}

      {isSuccess && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={data.results} onSelect={handleSelect} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
