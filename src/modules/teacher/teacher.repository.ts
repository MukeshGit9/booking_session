import { TeacherModel } from "./teacher.model.js";
import { Teacher } from "./teacher.types.js";

export const teacherRepo = {
    create: (data: Teacher) => {
        return TeacherModel.create(data);
    }
}