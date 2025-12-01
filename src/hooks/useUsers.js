import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loaderUsers } from '../redux/utils/actions';

export const useUsers = () => {
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    return new Promise((resolve, reject) => {
      dispatch(loaderUsers())
        .then((response) => resolve(response || []))
        .catch((error) => reject(error));
    });
  };

  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 1,
    staleTime: 10,
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
  });
};
