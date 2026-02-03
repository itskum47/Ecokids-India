# EcoKids India 🌱

A comprehensive educational platform for Indian students to learn about environment and health, inspired by kids.niehs.nih.gov but tailored for Indian context.

## 🚀 Features

- **Educational Topics**: Air, Water, Pollution, Biodiversity with Indian context
- **Interactive Games**: Maze games, puzzles, memory games with environmental themes
- **Science Experiments**: Step-by-step DIY experiments for home/school
- **Quizzes & Assessments**: Dynamic quizzes with instant feedback
- **Gamification**: EcoPoints, badges, levels, and leaderboards
- **Multi-language Support**: English + Hindi with expandable language options
- **Admin CMS**: Content management system for educators
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠 Technology Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Framer Motion for animations
- HTML5 Canvas for games

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Cloudinary for media storage
- bcrypt for password hashing

## 📁 Project Structure

```
ecokids-india/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── games/         # Game modules
│   │   ├── experiments/   # Experiment guides
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
├── shared/               # Shared utilities/types
├── seed/                 # Sample data
└── docs/                 # Documentation
```

## 🚦 Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ecokids-india
   npm run install:all
   ```

2. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running locally or use MongoDB Atlas
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecokids-india
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create topic (Admin)
- `PUT /api/topics/:id` - Update topic (Admin)
- `DELETE /api/topics/:id` - Delete topic (Admin)

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `POST /api/games/:id/score` - Submit game score
- `GET /api/games/leaderboard` - Get leaderboard

### Experiments
- `GET /api/experiments` - Get all experiments
- `GET /api/experiments/:id` - Get experiment by ID
- `POST /api/experiments/submit` - Submit experiment result

### Quizzes
- `GET /api/quizzes/:topicId` - Get quiz for topic
- `POST /api/quizzes/:topicId/submit` - Submit quiz answers
- `GET /api/quizzes/results/:userId` - Get user quiz results

## 🎮 Games Included

1. **EcoMaze Runner** - Navigate through pollution to clean areas
2. **Water Drop Memory** - Match water conservation pairs
3. **Recycling Sorter** - Sort waste into correct bins
4. **Animal Habitat Match** - Connect animals to their habitats
5. **Air Quality Detective** - Find pollution sources in city scenes

## 🧪 Experiments Included

1. **Water Filtration System** - Build a home water filter
2. **Soil pH Testing** - Test soil acidity with natural indicators
3. **Composting Setup** - Create a mini compost system
4. **Solar Oven** - Build a solar-powered cooking device
5. **Rain Water Harvesting Model** - Demonstrate water collection

## 👥 User Roles

- **Student**: Access content, play games, take quizzes, submit experiments
- **Teacher**: Monitor student progress, access teaching resources
- **Admin**: Full content management, user management, analytics

## 🏆 Gamification System

- **EcoPoints**: Earned through activities and correct answers
- **Badges**: Achievements for milestones and special activities
- **Levels**: Progress from Eco-Newbie to Eco-Expert
- **Leaderboards**: School, district, state, and national rankings

## 🌐 Localization

Currently supports:
- English (Primary)
- Hindi (हिंदी)

Expandable to:
- Bengali (বাংলা)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Marathi (मराठी)
- And more Indian languages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- XSS prevention

## 📱 Mobile Responsive

- Progressive Web App (PWA) capabilities
- Touch-friendly game controls
- Responsive design for all screen sizes
- Offline content caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by kids.niehs.nih.gov for educational structure
- Indian environmental data sources
- Open source libraries and contributors

---

**Made with ❤️ for Indian students and the environment 🌍**