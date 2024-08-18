import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
}, {
  timestamps: true,
});

export default User;
