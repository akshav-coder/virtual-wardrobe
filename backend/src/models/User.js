const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  avatar: {
    type: String,
    default: null
  },
  bodyMeasurements: {
    height: String,
    weight: String,
    chest: String,
    waist: String,
    hips: String,
    inseam: String,
    shoulder: String,
    sleeve: String,
    neck: String,
    shoeSize: String
  },
  preferences: {
    style: {
      type: String,
      enum: ['casual', 'formal', 'sporty', 'bohemian', 'vintage', 'modern'],
      default: 'casual'
    },
    colors: [{
      type: String,
      enum: ['White', 'Black', 'Blue', 'Gray', 'Brown', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Navy', 'Beige']
    }],
    brands: [String],
    budget: {
      type: Number,
      default: 1000
    },
    notifications: {
      type: Boolean,
      default: true
    },
    weatherAlerts: {
      type: Boolean,
      default: true
    },
    styleTips: {
      type: Boolean,
      default: true
    },
    newItemAlerts: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find by email (including password)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
