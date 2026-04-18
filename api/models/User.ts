import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/**
 * User Model
 * Defines the structure for user accounts in MongoDB.
 * Includes unique constraints for username and email.
 */
const UserSchema = new Schema({
    username: { type: String, required: true, min: 4, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = model('User', UserSchema);

export default UserModel;
