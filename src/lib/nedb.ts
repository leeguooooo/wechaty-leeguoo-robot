import Datastore from 'nedb'

class DB {
  db: any
  offset: number | undefined
  limitValue: number | undefined
  orderby: any

  constructor(database: string) {
    const options = {
      filename: database,
      autoload: true,
    }
    this.db = new Datastore(options)
  }

  limit = (offset: number, limitValue: number) => {
    this.offset = offset || 0
    this.limitValue = limitValue || 15
    return this
  }

  sort = (orderby: any) => {
    this.orderby = orderby
    return this
  }

  find = (query?: any, select?: any): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      let stmt = this.db.find(query || {})
      if (this.orderby !== undefined) {
        stmt.sort(this.orderby)
      }
      if (this.offset !== undefined) {
        stmt.skip(this.offset).limit(this.limitValue)
      }
      if (select != undefined) {
        stmt.projection(select || {})
      }
      stmt.exec((err: any, docs: any) => {
        if (err) {
          return reject(err)
        }
        resolve(docs)
      })
    })
  }

  findOne = (query: any, select: any) => {
    return new Promise((resolve, reject) => {
      let stmt = this.db.findOne(query || {})
      if (this.sort !== undefined) {
        stmt.sort(this.sort)
      }
      if (select != undefined) {
        stmt.projection(select || {})
      }
      stmt.exec((err: any, doc: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(doc)
      })
    })
  }
  insert = (values: any) => {
    return new Promise((resolve, reject) => {
      this.db.insert(values, (err: any, newDoc: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(newDoc)
      })
    })
  }
  update = (query: any, values: any, options?: any) => {
    return new Promise((resolve, reject) => {
      this.db.update(query || {}, values || {}, options || {}, (err: any, numAffected: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(numAffected)
      })
    })
  }
  remove = (query: any, options: any) => {
    return new Promise((resolve, reject) => {
      this.db.remove(query || {}, options || {}, (err: any, numAffected: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(numAffected)
      })
    })
  }
}

export default (database?: any) => {
  return new DB(database)
}
