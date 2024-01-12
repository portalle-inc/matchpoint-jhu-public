import { z } from 'zod';
import {db} from '@/config/prisma'

const objectId = z.string().refine(value => /^[0-9a-fA-F]{24}$/.test(value), {
  message: '"${path}" must be a valid mongo id',
});

const password = z.string().refine(value => value.length >= 8, {
  message: 'password must be at least 8 characters',
}).refine(value => /\d/.test(value) && /[a-zA-Z]/.test(value), {
  message: 'password must contain at least 1 letter and 1 number',
});

const whitelistEmail = z.string().email().refine(async value => {
  // use prisma institution table, check if email has doamin in institution table
  // get domain from email
  const domain = value.split('@')[1];
  // check if domainis in institution table
  const institution = await db.institution.findFirst({
    where: {
      domain: domain
    }
  });
  return institution ? true : false;
});

const termString = z.string().refine(value => {
  const termRegex = /^\d{4}\s(Winter|Spring|Summer|Fall)$/;
  return termRegex.test(value);
}, {
  message: 'Term must be in the format of \'YYYY (Winter|Spring|Summer|Fall)\''
});


export { objectId, password, whitelistEmail, termString };