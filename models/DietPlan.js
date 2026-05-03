const mongoose = require('mongoose');
const mealItemSchema = new mongoose.Schema({
  name: String,         // "Oatmeal with banana"
  quantity: String,     // "1 cup"
  calories: Number,
  protein: Number,      // grams
  carbs: Number,
  fats: Number,
});

const mealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'],
  },
  time: String,         // "8:00 AM"
  items: [mealItemSchema],
  totalCalories: Number,
  totalProtein: Number,
});

const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan'],
    required: true,
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance'],
  },
  dailyCalorieTarget: Number,
  dailyProteinTarget: Number,
  meals: [mealSchema],
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

mongoose.model('DietPlan', dietPlanSchema);
module.exports = mongoose.model('DietPlan', dietPlanSchema);