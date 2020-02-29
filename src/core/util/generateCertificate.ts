import * as selfsigned from 'selfsigned';

export const generateCertifcate = (ip: string) => {
  let perms = selfsigned.generate([{ name: 'commonName', value: `${ip}/` }], { days: 365 });
  return {
    cert: perms.cert,
    key: perms.private,
  };
}
