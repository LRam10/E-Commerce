import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { callAPI } from '../utils/utils';
import { useUser } from '../store/useUser';

//Single source of truth for "is there a valid auth cookie".
//Shared queryKey means every caller dedupes onto one request.
export function useAuthUser(){
  const setUser = useUser((state)=>state.setUser);
  const query = useQuery({
    queryKey:['user'],
    queryFn:()=> callAPI('/auth','GET'),
  });
  useEffect(()=>{
    //Wait for the first result, a 401 resolves to undefined and means logged out
    if(query.isPending) return;
    setUser(query.data ?? null);
  },[query.data, query.isPending, setUser]);
  return query;
}
