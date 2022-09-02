import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ["id", "nama", "ktp", "email"]
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { nama, ktp, tanggal_lahir, telepon, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({msg: "Password invalid"});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            nama: nama,
            ktp: ktp,
            tanggal_lahir: tanggal_lahir,
            telepon: telepon,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Sukses!"});
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                ktp: req.body.ktp
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({msg: "Password invalid"});
        const userId = user[0].id;
        const nama = user[0].nama;
        const ktp = user[0].ktp;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, nama, ktp, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '60s'
        });
        const refreshToken = jwt.sign({userId, nama, ktp, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({accessToken});

    } catch (error) {
        res.status(404).json({msg: "Nomor KTP tidak ditemukan"});
    }
}