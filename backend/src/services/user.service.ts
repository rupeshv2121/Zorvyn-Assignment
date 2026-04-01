import { userRepository } from "../repositories";
import { UpdateUserRoleDTO, UpdateUserStatusDTO, UserDTO } from "../types";
import { NotFoundError } from "../utils/errors";

export class UserService {
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    filters?: { role?: string; status?: string },
  ): Promise<{ users: UserDTO[]; total: number }> {
    const { users, total } = await userRepository.findAll(page, limit, filters);

    return {
      users: users.map((user) => userRepository.toDTO(user)),
      total,
    };
  }

  async getUserById(id: string): Promise<UserDTO> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return userRepository.toDTO(user);
  }

  async updateUserRole(id: string, data: UpdateUserRoleDTO): Promise<UserDTO> {
    const user = await userRepository.updateRole(id, data);
    return userRepository.toDTO(user);
  }

  async updateUserStatus(
    id: string,
    data: UpdateUserStatusDTO,
  ): Promise<UserDTO> {
    const user = await userRepository.updateStatus(id, data);
    return userRepository.toDTO(user);
  }
}

export const userService = new UserService();
