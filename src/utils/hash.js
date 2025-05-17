import bcrypt from 'bcrypt';

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);
