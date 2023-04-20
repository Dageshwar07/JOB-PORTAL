import userModel from "../models/userModel.js"

export async function registerController(req, res, next) {

    const { name, email, password } = req.body
    if (!name) {
        next('name is require')
    }
    if (!email) {

        next('email is require')
    }
    if (!password) {

        next('password is require and greater than 6 character')
    }
    const existinguser = await userModel.findOne({ email })
    if (existinguser) {

        // next('Email. already register please login')
    }
    const user = await userModel.create({ name, email, password })
    // TOKEN 
    const token = user.createJWT()
    res.status(201).send({
        success: true,
        message: 'user register successfully',
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
        },
        token,
    })
}
export const loginController = async (req, res, next) => {
    const { email, password } = req.body
    // validation
    if (!email || !password) {
        next('please provide all field')
    }
    // find user by email
    const user = await userModel.findOne({ email }).select("+password")
    if (!user) {
        next('invalid username or password')
    }
    // compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        next('invalid username or password')

    }
    user.password = undefined
    const token = user.createJWT()
    res.status(200).json({
        success: true,
        message: 'Login Successfully',
        user,
        token,
    })
}