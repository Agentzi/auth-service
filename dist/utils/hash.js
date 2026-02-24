import bcrypt from "bcrypt";
class Hash {
    /**
     * @access hash.hashPassword(password)
     * @param password string
     * @returns Promise<string>
     * @description This method is used to hash the user password
     */
    async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, process.env.SALT);
        return hashedPassword;
    }
    /**
     * @access hash.comparePassword(password, hashedPassword)
     * @param password string
     * @param hashedPassword string
     * @returns Boolean
     * @description This method is used to compare the user given password with hashed password
     */
    async comparePassword(password, hashedPassword) {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    }
}
export default new Hash();
