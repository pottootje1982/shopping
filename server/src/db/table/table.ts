import { Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';

@Injectable()
export default class Table {
  constructor(
    private db: Db,
    private tableName,
  ) {}

  table(): Collection<any> {
    return this.db.collection(this.tableName);
  }

  remove(query) {
    return this.table().deleteOne(query);
  }

  find(query) {
    return this.table().find(query).toArray();
  }

  all() {
    return this.table().find().toArray();
  }
}
