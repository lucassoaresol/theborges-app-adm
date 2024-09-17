import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.adm.agendar.barbearia.theborges.nom.br',
});
