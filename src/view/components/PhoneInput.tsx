import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { AuthService } from '@/app/services/AuthService';

import { Input } from './ui/Input';
import { Label } from './ui/Label';

export function PhoneInput() {
  const { setValue, watch, register, setError, clearErrors } = useFormContext();

  // Função para normalizar o número de telefone, adicionando o código do Brasil se necessário
  const normalizePhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    let valueReturn = value.trim();

    // Remove qualquer coisa que não seja número
    valueReturn = valueReturn.replace(/[\D]/g, '');

    // Se o número de telefone for brasileiro, garantir que tem 11 dígitos
    if (valueReturn.length === 11 || valueReturn.length === 10) {
      // Adiciona código do Brasil se não houver
      if (!valueReturn.startsWith('55')) {
        valueReturn = `55${valueReturn}`;
      }
    }

    // Remove o código de país 55 antes de formatar
    if (valueReturn.startsWith('55')) {
      valueReturn = valueReturn.slice(2);
    }

    // Formatação no estilo (XX) XXXXX-XXXX
    return valueReturn
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Função para extrair o número de telefone para salvar (no formato 55XXXXXXXXXXX)
  const extractPhoneNumber = (value: string | undefined) => {
    if (!value) return '';

    // Remove qualquer coisa que não seja número e adiciona +55
    const phone = `55${value.replace(/[\D]/g, '')}`;

    return phone;
  };

  useEffect(() => {
    const subscription = watch(async (formData, { name }) => {
      const rawPhone = formData.phoneData ?? '';
      const phone = formData.phone ?? '';
      const normalizedPhone = normalizePhoneNumber(rawPhone);

      // Atualiza o campo 'phoneData' com o número formatado
      if (rawPhone !== normalizedPhone) {
        setValue('phoneData', normalizedPhone);
        setValue('phone', extractPhoneNumber(normalizedPhone));
      }

      // Verifica o número de telefone quando ele tiver pelo menos 13 caracteres
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
