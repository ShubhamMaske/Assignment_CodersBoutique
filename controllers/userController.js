import User from '../models/user.js';
import { Op } from 'sequelize'

// Get User List API
export const getUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'User must be admin' });
    }

    try {
        const offset = (page - 1) * limit;
        const users = await User.findAndCountAll({
            attributes: ['id', 'name', 'email', 'createdAt'],
            offset: offset,
            limit: parseInt(limit),
            where: {
                role: {
                    [Op.ne]: 'Admin'
                }
            }
        });

        res.status(200).json({
            totalUsers: users.count,
            users: users.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in retrieving users', error });
    }
};

// Modify User API
export const updateUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.password) {
            return res.status(400).json({ message: 'To update password please do forgetpassword or reset-password'});
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete User API
export const deleteUser = async (req, res) => {
    // Check if the user is an admin
    const { id } = req.params
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete users.' });
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
