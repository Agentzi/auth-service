import HttpStatus from "../utils/http-status";
import db from "../config/db.config";
import { usersTable } from "../db/user";
import hash from "../utils/hash";
const AuthController = {
    /**
     * @method POST
     * @access /auth/register
     * @param req Request
     * @param res Response
     * @description This method is used for user registration
     */
    register: async (req, res) => {
        const { first_name, last_name, email, password, username } = req.body;
        if (!first_name || !last_name || !email || !password || !username) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: "Invalid request" });
        }
        try {
            try {
                const hashedPassword = await hash.hashPassword(password);
                await db.insert(usersTable).values({
                    email,
                    first_name,
                    last_name,
                    password: hashedPassword,
                    username,
                });
            }
            catch (err) {
                return res
                    .status(HttpStatus.CONFLICT)
                    .json({ message: "User already exists" });
            }
        }
        catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal Server Error", error });
        }
    },
};
export default AuthController;
