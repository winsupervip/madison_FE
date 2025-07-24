import {environment} from "../../../environments/environment";
import {RestBaseService} from "../../../services/rest-base.service";

export interface RoleEntity {
  id: string;
  userId: string;
  roleId: string;
}

export enum RoleEnum {
  user = "user",
  admin = "admin",
}
export class RoleService extends RestBaseService<RoleEntity> {
  constructor() {
    super(environment.apiUrl, "rest/byUserId");
  }
}

export const roleService = new RoleService();
