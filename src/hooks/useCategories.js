
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loaderCategories, loaderProducts } from '../redux/utils/actions';

export const useCategories = () => {
  const dispatch = useDispatch();

  const fetchCategories = async () => {
    return new Promise((resolve, reject) => {
      dispatch(loaderCategories())
        .then((response) => resolve(response?.categories || []))
        .catch((error) => reject(error));
    });
  };

  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 60000,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching categories:', error);
    },
  });
};

