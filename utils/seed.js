// backend/utils/seed.js
// ============================================================
// DATABASE SEEDER
// Run this ONCE to populate your database with sample data.
//
// Command:  node utils/seed.js
//
// It creates:
//   ✅ 1 Admin account
//   ✅ 3 Membership Plans (Monthly, Quarterly, Yearly)
//   ✅ 3 Workout Plans (Beginner, Intermediate, Advanced)
//   ✅ 2 Diet Plans (Veg + Non-Veg)
//   ✅ 3 Additional Services
//   ✅ 5 Sample Members
// ============================================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
const path     = require('path');

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// ── Import all models ────────────────────────────────────────
// We define them inline here so seed.js works standalone
// even if your model files have slight differences.

// ── Admin Schema ─────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, default: 'admin' },
}, { timestamps: true });

// ── Membership Plan Schema ────────────────────────────────────
const membershipPlanSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  duration:  { type: Number, required: true }, // days
  price:     { type: Number, required: true },
  features:  [String],
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

// ── Workout Plan Schema ───────────────────────────────────────
const exerciseSchema = new mongoose.Schema({
  name:        String,
  sets:        Number,
  reps:        String,
  restTime:    String,
  muscleGroup: String,
  instructions:String,
});

const workoutDaySchema = new mongoose.Schema({
  day:               String,
  focus:             String,
  exercises:         [exerciseSchema],
  estimatedDuration: Number,
});

const workoutPlanSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  level:      { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  goal:       { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'] },
  daysPerWeek:Number,
  schedule:   [workoutDaySchema],
  description:String,
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

// ── Diet Plan Schema ──────────────────────────────────────────
const mealItemSchema = new mongoose.Schema({
  name:     String,
  quantity: String,
  calories: Number,
  protein:  Number,
  carbs:    Number,
  fats:     Number,
});

const mealSchema = new mongoose.Schema({
  mealType: { type: String, enum: ['breakfast','morning_snack','lunch','evening_snack','dinner'] },
  time:     String,
  items:    [mealItemSchema],
});

const dietPlanSchema = new mongoose.Schema({
  name:               { type: String, required: true },
  type:               { type: String, enum: ['veg', 'non-veg', 'vegan'] },
  goal:               { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance'] },
  dailyCalorieTarget: Number,
  dailyProteinTarget: Number,
  meals:              [mealSchema],
  description:        String,
  isActive:           { type: Boolean, default: true },
}, { timestamps: true });

// ── Service Schema ────────────────────────────────────────────
const serviceSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  description:   String,
  pricePerMonth: Number,
  category:      { type: String, enum: ['fitness','wellness','nutrition','other'] },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

// ── Member Schema ─────────────────────────────────────────────
const memberSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, sparse: true, lowercase: true },
  age:              { type: Number, required: true },
  gender:           { type: String, enum: ['male','female','other'] },
  phone:            { type: String, required: true },
  address:          String,
  joiningDate:      { type: Date, default: Date.now },
  membershipPlan:   { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
  membershipExpiry: Date,
  membershipStatus: { type: String, enum: ['active','expired','pending'], default: 'pending' },
  assignedWorkout:  { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
  assignedDiet:     { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan' },
  weight:           Number,
  height:           Number,
  goal:             { type: String, enum: ['weight_loss','muscle_gain','maintenance','endurance'] },
  notes:            String,
}, { timestamps: true });

// Register models (use try/catch in case already registered)
const Admin          = mongoose.models.Admin          || mongoose.model('Admin',          adminSchema);
const MembershipPlan = mongoose.models.MembershipPlan || mongoose.model('MembershipPlan', membershipPlanSchema);
const WorkoutPlan    = mongoose.models.WorkoutPlan    || mongoose.model('WorkoutPlan',    workoutPlanSchema);
const DietPlan       = mongoose.models.DietPlan       || mongoose.model('DietPlan',       dietPlanSchema);
const Service        = mongoose.models.Service        || mongoose.model('Service',        serviceSchema);
const Member         = mongoose.models.Member         || mongoose.model('Member',         memberSchema);


// ════════════════════════════════════════════════════════════
// SEED DATA
// ════════════════════════════════════════════════════════════

const seedAdmin = {
  name:     'Gym Admin',
  email:    'admin@gym.com',
  password: 'admin123',   // will be hashed before saving
  role:     'admin',
};

const seedMembershipPlans = [
  {
    name:     'Monthly Basic',
    duration: 30,
    price:    999,
    features: ['Gym floor access', 'Locker room', 'Basic equipment'],
  },
  {
    name:     'Quarterly Standard',
    duration: 90,
    price:    2499,
    features: ['Gym floor access', 'Locker room', 'All equipment', '2 PT sessions'],
  },
  {
    name:     'Yearly Premium',
    duration: 365,
    price:    7999,
    features: [
      'Gym floor access',
      'Locker room',
      'All equipment',
      'Unlimited PT sessions',
      'Diet consultation',
      'Body composition analysis',
    ],
  },
];

const seedWorkoutPlans = [
  {
    name:        'Beginner Full Body',
    level:       'beginner',
    goal:        'maintenance',
    daysPerWeek: 3,
    description: 'Perfect for those just starting their fitness journey. Focuses on building basic strength and movement patterns with bodyweight and light resistance exercises.',
    schedule: [
      {
        day:               'Day 1 — Monday',
        focus:             'Full Body',
        estimatedDuration: 45,
        exercises: [
          { name: 'Warm-up (treadmill)', sets: 1, reps: '10 min', restTime: '—',   muscleGroup: 'Cardio' },
          { name: 'Push-ups',            sets: 3, reps: '10–12',  restTime: '60s', muscleGroup: 'Chest' },
          { name: 'Bodyweight Squats',   sets: 3, reps: '15',     restTime: '60s', muscleGroup: 'Legs' },
          { name: 'Dumbbell Rows',       sets: 3, reps: '10',     restTime: '60s', muscleGroup: 'Back' },
          { name: 'Plank Hold',          sets: 3, reps: '30 sec', restTime: '45s', muscleGroup: 'Core' },
        ],
      },
      {
        day:               'Day 2 — Wednesday',
        focus:             'Full Body',
        estimatedDuration: 45,
        exercises: [
          { name: 'Warm-up (cycling)',   sets: 1, reps: '10 min', restTime: '—',   muscleGroup: 'Cardio' },
          { name: 'Lunges',              sets: 3, reps: '12 each',restTime: '60s', muscleGroup: 'Legs' },
          { name: 'Incline Push-ups',    sets: 3, reps: '12',     restTime: '60s', muscleGroup: 'Chest' },
          { name: 'Lat Pulldowns',       sets: 3, reps: '12',     restTime: '60s', muscleGroup: 'Back' },
          { name: 'Bicycle Crunches',    sets: 3, reps: '20',     restTime: '45s', muscleGroup: 'Core' },
        ],
      },
      {
        day:               'Day 3 — Friday',
        focus:             'Full Body',
        estimatedDuration: 45,
        exercises: [
          { name: 'Jump Rope',           sets: 1, reps: '5 min',  restTime: '—',   muscleGroup: 'Cardio' },
          { name: 'Goblet Squats',       sets: 3, reps: '12',     restTime: '60s', muscleGroup: 'Legs' },
          { name: 'Dumbbell Press',      sets: 3, reps: '12',     restTime: '60s', muscleGroup: 'Chest' },
          { name: 'Seated Cable Rows',   sets: 3, reps: '12',     restTime: '60s', muscleGroup: 'Back' },
          { name: 'Dead Bug',            sets: 3, reps: '10 each',restTime: '45s', muscleGroup: 'Core' },
        ],
      },
    ],
  },
  {
    name:        'Intermediate Muscle Builder',
    level:       'intermediate',
    goal:        'muscle_gain',
    daysPerWeek: 4,
    description: 'Designed for those with 6+ months of training. Uses progressive overload principles to build lean muscle through compound and isolation movements.',
    schedule: [
      {
        day:               'Day 1 — Monday',
        focus:             'Chest & Triceps',
        estimatedDuration: 60,
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8–10', restTime: '90s', muscleGroup: 'Chest' },
          { name: 'Incline DB Press',    sets: 3, reps: '10–12',restTime: '75s', muscleGroup: 'Chest' },
          { name: 'Cable Flyes',         sets: 3, reps: '12–15',restTime: '60s', muscleGroup: 'Chest' },
          { name: 'Tricep Pushdowns',    sets: 3, reps: '12',   restTime: '60s', muscleGroup: 'Triceps' },
          { name: 'Skull Crushers',      sets: 3, reps: '10',   restTime: '60s', muscleGroup: 'Triceps' },
        ],
      },
      {
        day:               'Day 2 — Tuesday',
        focus:             'Back & Biceps',
        estimatedDuration: 60,
        exercises: [
          { name: 'Deadlifts',           sets: 4, reps: '6–8',  restTime: '120s',muscleGroup: 'Back' },
          { name: 'Pull-ups',            sets: 3, reps: '8–10', restTime: '90s', muscleGroup: 'Back' },
          { name: 'Barbell Rows',        sets: 3, reps: '10',   restTime: '75s', muscleGroup: 'Back' },
          { name: 'Barbell Curls',       sets: 3, reps: '12',   restTime: '60s', muscleGroup: 'Biceps' },
          { name: 'Hammer Curls',        sets: 3, reps: '12',   restTime: '60s', muscleGroup: 'Biceps' },
        ],
      },
      {
        day:               'Day 3 — Thursday',
        focus:             'Legs',
        estimatedDuration: 60,
        exercises: [
          { name: 'Barbell Squats',      sets: 4, reps: '8–10', restTime: '120s',muscleGroup: 'Quads' },
          { name: 'Romanian Deadlifts',  sets: 3, reps: '10',   restTime: '90s', muscleGroup: 'Hamstrings' },
          { name: 'Leg Press',           sets: 3, reps: '12–15',restTime: '75s', muscleGroup: 'Quads' },
          { name: 'Leg Curls',           sets: 3, reps: '12',   restTime: '60s', muscleGroup: 'Hamstrings' },
          { name: 'Calf Raises',         sets: 4, reps: '15–20',restTime: '45s', muscleGroup: 'Calves' },
        ],
      },
      {
        day:               'Day 4 — Friday',
        focus:             'Shoulders & Core',
        estimatedDuration: 55,
        exercises: [
          { name: 'Overhead Press',      sets: 4, reps: '8–10', restTime: '90s', muscleGroup: 'Shoulders' },
          { name: 'Lateral Raises',      sets: 3, reps: '12–15',restTime: '60s', muscleGroup: 'Shoulders' },
          { name: 'Face Pulls',          sets: 3, reps: '15',   restTime: '60s', muscleGroup: 'Rear Delts' },
          { name: 'Weighted Plank',      sets: 3, reps: '45 sec',restTime:'45s', muscleGroup: 'Core' },
          { name: 'Cable Crunches',      sets: 3, reps: '15',   restTime: '45s', muscleGroup: 'Core' },
        ],
      },
    ],
  },
  {
    name:        'Advanced Powerlifting',
    level:       'advanced',
    goal:        'muscle_gain',
    daysPerWeek: 5,
    description: 'High-intensity program for experienced lifters. Focuses on the big three (squat, bench, deadlift) with accessory work. Not for beginners.',
    schedule: [
      {
        day:               'Day 1 — Monday',
        focus:             'Heavy Squat',
        estimatedDuration: 75,
        exercises: [
          { name: 'Barbell Squats',      sets: 5, reps: '5',    restTime: '180s',muscleGroup: 'Legs' },
          { name: 'Front Squats',        sets: 3, reps: '5',    restTime: '120s',muscleGroup: 'Quads' },
          { name: 'Leg Press',           sets: 3, reps: '10',   restTime: '90s', muscleGroup: 'Legs' },
          { name: 'Leg Extensions',      sets: 3, reps: '12',   restTime: '60s', muscleGroup: 'Quads' },
        ],
      },
      {
        day:               'Day 2 — Tuesday',
        focus:             'Heavy Bench',
        estimatedDuration: 70,
        exercises: [
          { name: 'Bench Press',         sets: 5, reps: '5',    restTime: '180s',muscleGroup: 'Chest' },
          { name: 'Close Grip Bench',    sets: 3, reps: '6',    restTime: '120s',muscleGroup: 'Triceps' },
          { name: 'Weighted Dips',       sets: 3, reps: '8',    restTime: '90s', muscleGroup: 'Chest' },
          { name: 'Tricep Pushdowns',    sets: 3, reps: '10',   restTime: '60s', muscleGroup: 'Triceps' },
        ],
      },
      {
        day:               'Day 3 — Wednesday',
        focus:             'Back & Deadlift Prep',
        estimatedDuration: 70,
        exercises: [
          { name: 'Deadlifts',           sets: 5, reps: '5',    restTime: '180s',muscleGroup: 'Back' },
          { name: 'Barbell Rows',        sets: 4, reps: '6',    restTime: '120s',muscleGroup: 'Back' },
          { name: 'Weighted Pull-ups',   sets: 3, reps: '6',    restTime: '90s', muscleGroup: 'Back' },
        ],
      },
    ],
  },
];

const seedDietPlans = [
  {
    name:               'Vegetarian Weight Loss',
    type:               'veg',
    goal:               'weight_loss',
    dailyCalorieTarget: 1500,
    dailyProteinTarget: 100,
    description:        'A balanced vegetarian plan with high protein and low calories. Ideal for healthy, sustainable weight loss without feeling hungry.',
    meals: [
      {
        mealType: 'breakfast',
        time:     '7:30 AM',
        items: [
          { name: 'Oatmeal',            quantity: '1 cup',    calories: 150, protein: 5,  carbs: 27, fats: 3  },
          { name: 'Banana',             quantity: '1 medium', calories: 90,  protein: 1,  carbs: 23, fats: 0  },
          { name: 'Low-fat milk',       quantity: '200 ml',   calories: 70,  protein: 6,  carbs: 10, fats: 2  },
        ],
      },
      {
        mealType: 'morning_snack',
        time:     '10:30 AM',
        items: [
          { name: 'Mixed nuts',         quantity: '30g',      calories: 180, protein: 5,  carbs: 6,  fats: 16 },
          { name: 'Green tea',          quantity: '1 cup',    calories: 5,   protein: 0,  carbs: 1,  fats: 0  },
        ],
      },
      {
        mealType: 'lunch',
        time:     '1:00 PM',
        items: [
          { name: 'Brown rice',         quantity: '1 cup',    calories: 215, protein: 5,  carbs: 45, fats: 2  },
          { name: 'Dal (lentils)',      quantity: '1 cup',    calories: 230, protein: 18, carbs: 40, fats: 1  },
          { name: 'Paneer bhurji',      quantity: '100g',     calories: 200, protein: 14, carbs: 4,  fats: 14 },
          { name: 'Cucumber salad',     quantity: '1 bowl',   calories: 30,  protein: 1,  carbs: 6,  fats: 0  },
        ],
      },
      {
        mealType: 'evening_snack',
        time:     '4:30 PM',
        items: [
          { name: 'Greek yogurt',       quantity: '150g',     calories: 90,  protein: 15, carbs: 6,  fats: 1  },
          { name: 'Apple',              quantity: '1 medium', calories: 80,  protein: 0,  carbs: 21, fats: 0  },
        ],
      },
      {
        mealType: 'dinner',
        time:     '7:30 PM',
        items: [
          { name: 'Chapati (wheat)',    quantity: '2 pieces', calories: 200, protein: 6,  carbs: 38, fats: 3  },
          { name: 'Mixed veg curry',    quantity: '1 cup',    calories: 150, protein: 5,  carbs: 20, fats: 6  },
          { name: 'Tofu (grilled)',     quantity: '100g',     calories: 120, protein: 13, carbs: 2,  fats: 6  },
        ],
      },
    ],
  },
  {
    name:               'Non-Veg Muscle Gain',
    type:               'non-veg',
    goal:               'muscle_gain',
    dailyCalorieTarget: 2800,
    dailyProteinTarget: 180,
    description:        'High protein non-vegetarian diet plan designed to maximize muscle growth. Rich in lean meats, eggs, and complex carbohydrates.',
    meals: [
      {
        mealType: 'breakfast',
        time:     '7:00 AM',
        items: [
          { name: 'Whole eggs (boiled)', quantity: '4 eggs',  calories: 280, protein: 24, carbs: 2,  fats: 20 },
          { name: 'Whole wheat bread',   quantity: '3 slices',calories: 240, protein: 9,  carbs: 48, fats: 3  },
          { name: 'Peanut butter',       quantity: '2 tbsp',  calories: 190, protein: 8,  carbs: 6,  fats: 16 },
          { name: 'Whole milk',          quantity: '250 ml',  calories: 150, protein: 8,  carbs: 12, fats: 8  },
        ],
      },
      {
        mealType: 'morning_snack',
        time:     '10:00 AM',
        items: [
          { name: 'Whey protein shake',  quantity: '1 scoop', calories: 120, protein: 25, carbs: 5,  fats: 2  },
          { name: 'Banana',              quantity: '1 large', calories: 110, protein: 1,  carbs: 29, fats: 0  },
        ],
      },
      {
        mealType: 'lunch',
        time:     '1:00 PM',
        items: [
          { name: 'Chicken breast',      quantity: '200g',    calories: 330, protein: 62, carbs: 0,  fats: 7  },
          { name: 'White rice',          quantity: '1.5 cup', calories: 320, protein: 6,  carbs: 68, fats: 1  },
          { name: 'Steamed broccoli',    quantity: '1 cup',   calories: 55,  protein: 4,  carbs: 11, fats: 1  },
          { name: 'Olive oil (cooking)', quantity: '1 tbsp',  calories: 120, protein: 0,  carbs: 0,  fats: 14 },
        ],
      },
      {
        mealType: 'evening_snack',
        time:     '4:30 PM',
        items: [
          { name: 'Hard boiled eggs',    quantity: '2 eggs',  calories: 140, protein: 12, carbs: 1,  fats: 10 },
          { name: 'Mixed nuts',          quantity: '30g',     calories: 180, protein: 5,  carbs: 6,  fats: 16 },
        ],
      },
      {
        mealType: 'dinner',
        time:     '8:00 PM',
        items: [
          { name: 'Salmon fillet',       quantity: '200g',    calories: 416, protein: 46, carbs: 0,  fats: 24 },
          { name: 'Sweet potato',        quantity: '200g',    calories: 180, protein: 4,  carbs: 41, fats: 0  },
          { name: 'Mixed green salad',   quantity: '1 bowl',  calories: 40,  protein: 2,  carbs: 8,  fats: 0  },
        ],
      },
    ],
  },
];

const seedServices = [
  {
    name:          'Personal Training',
    description:   'One-on-one sessions with a certified personal trainer. Customized workout programs tailored to your specific goals and fitness level.',
    pricePerMonth: 3000,
    category:      'fitness',
  },
  {
    name:          'Yoga Classes',
    description:   'Daily group yoga sessions for flexibility, balance, and mental wellness. Suitable for all levels from beginner to advanced.',
    pricePerMonth: 1500,
    category:      'wellness',
  },
  {
    name:          'Diet Consultation',
    description:   'Monthly sessions with a certified nutritionist. Personalized meal plans, macro tracking guidance, and weekly check-ins.',
    pricePerMonth: 2000,
    category:      'nutrition',
  },
  {
    name:          'Zumba Classes',
    description:   'High-energy dance fitness classes. Fun cardio workout for weight loss and improved coordination.',
    pricePerMonth: 1200,
    category:      'fitness',
  },
  {
    name:          'Swimming',
    description:   'Access to the swimming pool with optional coaching sessions. Great for full-body cardio and joint-friendly exercise.',
    pricePerMonth: 2500,
    category:      'fitness',
  },
];

const seedMembers = (planIds, workoutIds, dietIds) => [
  {
    name:             'Rahul Sharma',
    email:            'rahul@example.com',
    age:              28,
    gender:           'male',
    phone:            '9876543210',
    address:          '12 MG Road, Indore, MP',
    membershipPlan:   planIds[1],  // Quarterly
    membershipExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    membershipStatus: 'active',
    assignedWorkout:  workoutIds[1],
    assignedDiet:     dietIds[1],
    weight:           75,
    height:           178,
    goal:             'muscle_gain',
    notes:            'Prefers morning sessions. Has mild lower back issue — avoid heavy deadlifts initially.',
  },
  {
    name:             'Priya Patel',
    email:            'priya@example.com',
    age:              24,
    gender:           'female',
    phone:            '9123456789',
    address:          '45 Vijay Nagar, Indore, MP',
    membershipPlan:   planIds[0],  // Monthly
    membershipExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days — expiring soon
    membershipStatus: 'active',
    assignedWorkout:  workoutIds[0],
    assignedDiet:     dietIds[0],
    weight:           58,
    height:           162,
    goal:             'weight_loss',
    notes:            'Vegetarian. Interested in adding yoga sessions.',
  },
  {
    name:             'Amit Verma',
    email:            'amit@example.com',
    age:              35,
    gender:           'male',
    phone:            '9988776655',
    address:          '7 Scheme 54, Indore, MP',
    membershipPlan:   planIds[2],  // Yearly
    membershipExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // 300 days
    membershipStatus: 'active',
    assignedWorkout:  workoutIds[2],
    assignedDiet:     dietIds[1],
    weight:           82,
    height:           175,
    goal:             'muscle_gain',
    notes:            'Advanced lifter. Competes in local powerlifting meets.',
  },
  {
    name:             'Sneha Joshi',
    age:              22,
    gender:           'female',
    phone:            '9765432100',
    address:          'Palasia, Indore, MP',
    membershipExpiry: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // expired 15 days ago
    membershipStatus: 'expired',
    weight:           52,
    height:           158,
    goal:             'maintenance',
  },
  {
    name:             'Rohan Singh',
    age:              30,
    gender:           'male',
    phone:            '9654321098',
    membershipStatus: 'pending',
    weight:           68,
    height:           170,
    goal:             'endurance',
    notes:            'New joiner — plan not selected yet.',
  },
];


// ════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ════════════════════════════════════════════════════════════

const seed = async () => {
  try {
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to:', process.env.MONGO_URI);

    // ── 1. Clear existing data ──────────────────────────────
    console.log('\n🗑️  Clearing old data...');
    await Promise.all([
      Admin.deleteMany({}),
      MembershipPlan.deleteMany({}),
      WorkoutPlan.deleteMany({}),
      DietPlan.deleteMany({}),
      Service.deleteMany({}),
      Member.deleteMany({}),
    ]);
    console.log('✅ Old data cleared');

    // ── 2. Create Admin ─────────────────────────────────────
    console.log('\n👤 Creating admin...');
    const hashedPassword = await bcrypt.hash(seedAdmin.password, 12);
    await Admin.create({ ...seedAdmin, password: hashedPassword });
    console.log(`✅ Admin created → Email: ${seedAdmin.email} | Password: ${seedAdmin.password}`);

    // ── 3. Create Membership Plans ──────────────────────────
    console.log('\n💳 Creating membership plans...');
    const plans = await MembershipPlan.insertMany(seedMembershipPlans);
    console.log(`✅ ${plans.length} membership plans created`);
    plans.forEach(p => console.log(`   • ${p.name} — ₹${p.price} (${p.duration} days)`));

    // ── 4. Create Workout Plans ─────────────────────────────
    console.log('\n🏋️  Creating workout plans...');
    const workouts = await WorkoutPlan.insertMany(seedWorkoutPlans);
    console.log(`✅ ${workouts.length} workout plans created`);
    workouts.forEach(w => console.log(`   • ${w.name} (${w.level})`));

    // ── 5. Create Diet Plans ────────────────────────────────
    console.log('\n🥗 Creating diet plans...');
    const diets = await DietPlan.insertMany(seedDietPlans);
    console.log(`✅ ${diets.length} diet plans created`);
    diets.forEach(d => console.log(`   • ${d.name} — ${d.dailyCalorieTarget} kcal/day`));

    // ── 6. Create Services ──────────────────────────────────
    console.log('\n⚡ Creating services...');
    const services = await Service.insertMany(seedServices);
    console.log(`✅ ${services.length} services created`);
    services.forEach(s => console.log(`   • ${s.name} — ₹${s.pricePerMonth}/month`));

    // ── 7. Create Sample Members ────────────────────────────
    console.log('\n👥 Creating sample members...');
    const memberData = seedMembers(
      plans.map(p => p._id),
      workouts.map(w => w._id),
      diets.map(d => d._id)
    );
    const members = await Member.insertMany(memberData);
    console.log(`✅ ${members.length} sample members created`);
    members.forEach(m => console.log(`   • ${m.name} — ${m.membershipStatus}`));

    // ── Done ────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═'.repeat(50));
    console.log('\n📋 Login Credentials:');
    console.log(`   URL:      http://localhost:5173`);
    console.log(`   Email:    ${seedAdmin.email}`);
    console.log(`   Password: ${seedAdmin.password}`);
    console.log('\n📊 Summary:');
    console.log(`   Admins:            1`);
    console.log(`   Membership Plans:  ${plans.length}`);
    console.log(`   Workout Plans:     ${workouts.length}`);
    console.log(`   Diet Plans:        ${diets.length}`);
    console.log(`   Services:          ${services.length}`);
    console.log(`   Members:           ${members.length}`);
    console.log('\n✅ You can now start the app and log in!\n');

  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   MongoDB is not running! Start it with: mongod');
    }
    if (error.message.includes('MONGO_URI')) {
      console.error('   Check your backend/.env file has MONGO_URI defined');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeder
seed();