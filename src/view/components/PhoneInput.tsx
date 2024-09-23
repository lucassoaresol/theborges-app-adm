import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useVerifyPhone } from '@/app/hooks/useVerifyPhone';

import { Input } from './ui/Input';
import { Label } from './ui/Label';

export function PhoneInput() {
  const { verifyPhone } = useVerifyPhone();
  const { setValue, watch, register, setError, clearErrors } = useFormContext();

  const normalizePhoneNumber = (value: string) => {
    if (!value) return '';

    let valueReturn = value.trim();

    valueReturn = valueReturn.replace(/[^\d+]/g, '');

    if (valueReturn.startsWith('+')) {
      valueReturn = valueReturn.slice(1);
    }

    if (!valueReturn.startsWith('55') && valueReturn.length >= 10) {
      valueReturn = `55${valueReturn}`;
    }

    if (valueReturn.startsWith('55') && valueReturn.length > 11) {
      valueReturn = valueReturn.slice(2);
    }

    return valueReturn
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const extractPhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    const phone = `55${value.replace(/[^\d]/g, '')}`;

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

      if (name === 'phone' && phone.length >= 12) {
        verifyPhone(phone)
          .then(() => clearErrors('phoneData'))
          .catch(() => {
            setError('phoneData', {
              type: 'validate',
              message: 'O Whatsapp informado é inválido',
            });
            setValue('phone', '');
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, setError, clearErrors, verifyPhone]);

  return (
    <>
      <Label htmlFor="phoneData">Whatsapp</Label>
      <Input id="phoneData" {...register('phoneData')} />
    </>
  );
}
