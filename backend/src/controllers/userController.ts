import { Request, Response } from 'express';
import { UserModel, User } from '../models/User';
import asyncHandler from '../middleware/asyncHandler';

export class UserController {
  // Get all users
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await UserModel.findAll(limit, offset);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        limit,
        offset,
        count: users.length
      }
    });
  });

  // Get user by ID
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserModel.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  });

  // Create new user
  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, first_name, last_name } = req.body;

    // Basic validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: email, password, first_name, last_name'
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // In a real app, you would hash the password here
    // For now, we'll just store it as is (NOT recommended for production)
    const userData = {
      email,
      password_hash: password, // Should be hashed!
      first_name,
      last_name
    };

    const newUser = await UserModel.create(userData);

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        created_at: newUser.created_at
      }
    });
  });

  // Update user
  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const updatedUser = await UserModel.update(parseInt(id), updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: updatedUser
    });
  });

  // Delete user
  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await UserModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  });
}

export default UserController;
