import { httpClient } from './httpClient';

interface ISignUpDTO {
  name: string;
  phone: string;
  password: string;
  username: string;
}

interface ISignInDTO {
  username: string;
  password: string;
}

interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async signUp({ name, password, phone, username }: ISignUpDTO) {
    const { data } = await httpClient.post('/auth/sign-up', {
      name,
      password,
      phone,
      username,
    });

    return data;
  }

  static async signIn({ password, username }: ISignInDTO) {
    const { data } = await httpClient.post<ISignInResponse>('/auth/sign-in', {
      password,
      username,
    });

    return data;
  }

  static async refreshToken(refreshToken: string) {
    const { data } = await httpClient.post<ISignInResponse>('/auth/refresh-token', {
      refreshToken,
    });

    return data;
  }

  static async verifyPhone(phone: string) {
    await httpClient.post('/auth/phone', {
      phone,
    });
  }
}
