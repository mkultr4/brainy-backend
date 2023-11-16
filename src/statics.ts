

export enum Roles {
  Admin = 'Admin',
  CoAdmin = 'Coadmin',
  Team = 'team',
  Manager = 'manager',
  Guest = 'Guest',
}

export const JsonToken = {
  path: './config/key',
  keys: {
    private: '/jwtRS256.key',
    public: '/jwtRS256.key.pub'
  }
};
