import { z } from "zod";

const signupFormSchema = z.object({
    name: z.string().nonempty("Name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export default signupFormSchema;