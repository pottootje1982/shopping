import Table from './table';
import { createCipheriv, createDecipheriv } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class UserDb extends Table {
  constructor(
    @Inject() db: Db,
    @Inject('PUBLIC_KEY') private publicKey: string,
    @Inject('INIT_VECTOR') private initVector: string,
  ) {
    super(db, 'users');
  }

  async getUser(mail) {
    if (!mail) return;
    const user = await this.table().findOne({ mail });
    let { picnicPass, paprikaPass } = user;
    picnicPass = picnicPass && this.decrypt(picnicPass);
    paprikaPass = paprikaPass && this.decrypt(paprikaPass);
    return { ...user, picnicPass, paprikaPass };
  }

  async getUsers() {
    const users = await this.table().find().toArray();
    return users;
  }

  storeUser(mail, user) {
    let { picnicPass, paprikaPass } = user;
    picnicPass = picnicPass && this.encrypt(picnicPass);
    paprikaPass = paprikaPass && this.encrypt(paprikaPass);
    return this.table().findOneAndReplace(
      { mail },
      { mail, ...user, picnicPass, paprikaPass },
      { upsert: true },
    );
  }

  encrypt(text) {
    if (!text) return text;
    const cipher = createCipheriv(
      'aes-256-cbc',
      this.publicKey,
      this.initVector,
    );
    let crypted = cipher.update(text, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(value) {
    if (!value) return value;
    const decipher = createDecipheriv(
      'aes-256-cbc',
      this.publicKey,
      this.initVector,
    );
    let decryptedData = decipher.update(value, 'hex', 'utf-8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
}
