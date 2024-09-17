import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { AuthService } from '@/app/services/AuthService';

import { Input } from './ui/Input';
import { Label } from './ui/Label';

export function PhoneInput() {
  const { setValue, watch, register, setError, clearErrors } = useFormContext();

  const normalizePhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    let valueReturn = value;

    if (value.startsWith('+55')) {
      valueReturn = valueReturn.replace('+55', '').trim();
    }

    return valueReturn
      .replace(/[\D]/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const extractPhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    const phone = `55${value.replace(/[\D]/g, '')}`;

    return phone;
  };

  useEffect(() => {
    const subscription = watch(async (formData, { name }) => {
      const rawPhone = formData.phoneData ?? '';
      const phone = formData.phone ?? '';
      const normalizedPhone = normalizePhoneNumber(rawPhone);

      if (rawPhone !== normalizedPhone) {
        setValue('phoneData', normalizedPhone);
        setValue('phone', extractPhoneNumber(normalizedPhone));
      }

      if (name === 'phone' && phone.length >= 13) {
        AuthService.verifyPhone(phone)
          .then(() => clearErrors('phoneData'))
          .catch(() =>
            setError('phoneData', {
              type: 'validate',
              message: 'O Whatsapp informado é inválido',
            }),
          );
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, setError, clearErrors]);

  return (
    <>
      <Label htmlFor="phoneData">Whatsapp</Label>
      <Input id="phoneData" {...register('phoneData')} />
    </>
  );
}
