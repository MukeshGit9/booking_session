import { teacherRepo } from "./teacher.repository.js";
import { Teacher } from "./teacher.types.js";

export const teacherService = {
    create: async (data: Teacher) => {
        const result = await teacherRepo.create(data);
        return result;
    }
}