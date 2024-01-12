import { z } from 'zod';
import { password, whitelistEmail } from './custom.validation';

// const createUser = z.object({
//   body: z.object({
//     email: z.string().email(),
//     password: password,
//     name: z.string(),
//     role: z.enum(["user", "admin"]),
//   }),
// });

// const getUsers = z.object({
//   query: z.object({
//     name: z.string().optional(),
//     role: z.string().optional(),
//     sortBy: z.string().optional(),
//     limit: z.number().int().optional(),
//     page: z.number().int().optional(),
//   }),
// });

// const getUser = z.object({
//   params: z.object({
//     userId: z.string(), // replace with your custom objectId validation
//   }),
// });

const updateUser = z.object({
    email: whitelistEmail.optional(),
    password: password.optional(),
});

// const deleteUser = z.object({
//   params: z.object({
//     userId: z.string(), // replace with your custom objectId validation
//   }),
// });

export default {
  // createUser,
  // getUsers,
  // getUser,
  updateUser,
  // deleteUser,
};