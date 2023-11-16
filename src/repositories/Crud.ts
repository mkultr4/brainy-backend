
export interface Crud<T, K> {
  get(params: K): Promise<T>;

  save(json: T): Promise<T>;

  delete(keys: any): Promise<undefined>;

  update(keys: any, params: any): Promise<any>;
}

export interface BaseCrud<M> {
  get(params: any): Promise<M | undefined>;

  save(model: M): Promise<M>;

  delete(keys: any): Promise<undefined>;

  update(keys: any, params: any): Promise<M>;
}
