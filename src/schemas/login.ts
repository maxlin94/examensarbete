import {z} from "zod"

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().nonempty("Please enter a password"),
})

export default loginSchema;