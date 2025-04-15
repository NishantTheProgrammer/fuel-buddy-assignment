import { Request, Response, RequestHandler } from 'express';
import User from '../models/User';

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ error: 'Failed to create user' });
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const getUserByEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Get user by email error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}; 