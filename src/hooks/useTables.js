import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loaderTables } from '../redux/utils/actions';

export const useTables = () => {
  const dispatch = useDispatch();

  const fetchTables = async () => {
    return new Promise((resolve, reject) => {
      dispatch(loaderTables())
        .then((response) => resolve(response || []))
        .catch((error) => reject(error));
    });
  };

  return useQuery({
    queryKey: ['tables'],
    queryFn: fetchTables,
    retry: 1,
    staleTime: 10,
    onError: (error) => {
      console.error('Error fetching tables:', error);
    },
  });
};
