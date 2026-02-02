import { get } from '../Utility/httpInterceptor';
import { GET_USER_API } from '../Utility/ApiList';

/**
 * User data from the API
 */
export interface UserData {
  id?: string | number;
  username?: string;
  email?: string;
  profile_image?: string;
  profileImage?: string;
  picture?: string;
  avatarUrl?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Fetch current user data
 * 
 * @returns User data object
 * @throws Error if the API returns an error
 */
export const fetchUser = async (): Promise<UserData> => {
  const response: any = await get(GET_USER_API);
  
  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch user data');
  }
  
  return response.data.data || {};
};
