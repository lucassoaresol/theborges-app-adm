import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from './ui/Input';
import { Label } from './ui/Label';

export function PhoneInput() {
  const { setValue, watch, register } = useFormContext();

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
    const subscription = watch(async (formData) => {
      const rawPhone = formData.phoneData ?? '';
      const normalizedPhone = normalizePhoneNumber(rawPhone);

      if (rawPhone !== normalizedPhone) {
        setValue('phoneData', normalizedPhone);
        setValue('phone', extractPhoneNumber(normalizedPhone));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <>
      <Label htmlFor="phoneData">Whatsapp</Label>
      <Input id="phoneData" {...register('phoneData')} />
    </>
  );
}
