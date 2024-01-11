import bcrypt from "bcrypt"


export const encryptPassword = async (password) => {
    const saltRound = 10
    const hash = bcrypt.hash(password, saltRound)
    try {
        return hash
    } catch (error) {
        console.log(error)
    }
}

export const compareEncryptedPassword = async (password, encryptedPassword) => {
    return await bcrypt.compare(password,encryptedPassword)
     
}