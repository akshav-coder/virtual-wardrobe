const bcrypt = require('bcryptjs');

// In-memory storage for testing (replace with MongoDB later)
let users = [];
let nextId = 1;

class InMemoryUser {
  constructor(data) {
    this.id = nextId++;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone || null;
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || null;
    this.avatar = data.avatar || null;
    this.bodyMeasurements = data.bodyMeasurements || {};
    this.preferences = {
      style: 'casual',
      colors: [],
      brands: [],
      budget: 1000,
      notifications: true,
      weatherAlerts: true,
      styleTips: true,
      newItemAlerts: true,
      ...data.preferences
    };
    this.isActive = true;
    this.lastLogin = new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Hash password before saving
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  // Check password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Get public profile (without sensitive data)
  getPublicProfile() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }

  // Save user to in-memory storage
  async save() {
    // Hash password before saving
    if (this.password) {
      this.password = await InMemoryUser.hashPassword(this.password);
    }
    
    users.push(this);
    return this;
  }

  // Find user by email
  static async findByEmail(email) {
    const user = users.find(u => u.email === email);
    if (!user) return null;
    
    // Create a copy with password for comparison
    const userWithPassword = { ...user };
    return userWithPassword;
  }

  // Find user by ID
  static async findById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return null;
    
    // Create a copy without password
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  // Update user
  static async findByIdAndUpdate(id, updates, options = {}) {
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date() };
    return users[userIndex];
  }

  // Find one user
  static async findOne(query) {
    if (query.email) {
      return await InMemoryUser.findByEmail(query.email);
    }
    return null;
  }
}

module.exports = InMemoryUser;
