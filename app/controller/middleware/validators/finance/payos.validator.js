import * as Yup from 'yup';

export const yupPayOS = Yup.object({
  payos: Yup.object({
    clientId: Yup.string().required('Client ID required'),
    apiKey: Yup.string().required('Api Key required'),
    checksum: Yup.string().required('Checksum is required')
  }).required()
});
