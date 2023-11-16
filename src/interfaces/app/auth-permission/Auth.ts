import { User } from '../../../models/auth-permissions/User';

export interface Registration {
  createdAt: number;
  userRegistered: User;
  params?: {
    type: String,
    reference?: String
  };
}
