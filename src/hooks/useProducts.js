
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loaderProducts } from '../redux/utils/actions';

export const useProducts = () => {
  const dispatch = useDispatch();

  const fetchProducts = async () => {
    return new Promise((resolve, reject) => {
      dispatch(loaderProducts())
        .then((response) => resolve(response?.products || []))
        .catch((error) => reject(error));
    });
  };

  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 1,
    staleTime: 10,
    onError: (error) => {
      console.error('Error fetching products:', error);
    },
  });
};

