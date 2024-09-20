/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';

import { AuthService } from '../services/AuthService';

export const useVerifyPhone = () => {
  const [loading, setLoading] = useState(false);

  const verifyPhone = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      await AuthService.verifyPhone(phone);
    } finally {
      setLoading(false);
    }
  }, []);

  return { verifyPhone, loading };
};
