import { User} from '../models/User';
import { UserRole } from '../models/UserRoles';
import asyncHandler from '../middleware/asyncHandler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const register= asyncHandler(async(req:Request, res:Response)=>{
    const {username,password,role}= req.body;
    if(!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Invalid user role' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.status(201).json({ token });
});

const login= asyncHandler(async(req:Request, res:Response)=>{
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
});

const updateDetails= asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { username, role } = req.body;
    if (!username || !role) {
        return res.status(400).json({ message: 'Username and role are required' });
    }
    const user = await User.findByIdAndUpdate(userId, { username, role }, { new: true, runValidators: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
});


const logout = asyncHandler(async (req: Request, res: Response) => {
    // Invalidate the token on the client side, as JWTs are stateless and cannot be invalidated server-side
    // Here we just send a success message
    res.json({ message: 'Logged out successfully' });
});

const authController = {
    register,
    login,
    logout,
    updateDetails
};

export default authController;