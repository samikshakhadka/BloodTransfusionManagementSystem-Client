# Blood Donation Management System

A comprehensive web-based platform designed to facilitate efficient blood donation and distribution using a weighted scoring model for optimal donor-patient matching.

## 🏗️ System Architecture

The system follows a modern client-server architecture with clean separation of concerns:

- **Frontend**: React with Redux for state management
- **Backend**: .NET 8 with ASP.NET MVC framework
- **Database**: MySQL with cloud hosting
- **Authentication**: SHA-256 hashing with salt mechanisms
- **API Design**: RESTful API with repository patterns

## 🚀 Key Features

### Core Functionality
- **Real-time blood inventory tracking** with visual analytics
- **Multi-tiered role-based access control** for different stakeholders
- **Weighted scoring model** for optimal donor-patient matching
- **Geographic proximity calculation** using Haversine formula
- **Offline functionality** for rural areas with limited connectivity

### User Roles
- **Hospital**: Donor registration, inventory management, blood requests
- **Local Government (Municipality)**: View donation requests and donors
- **Red Cross**: Donor registration and inventory creation
- **Super Admin**: System oversight and user management

## 🛠️ Technology Stack

### Frontend
- **React** - Component-based UI framework
- **Redux** - State management
- **HTML/CSS/Tailwind** - Styling and responsive design
- **Chart.js** - Data visualization and analytics
- **Leaflet.js** - Interactive mapping
- **Toastify** - User notifications

### Backend
- **.NET 8** - Server-side framework
- **ASP.NET MVC** - Web application framework
- **C#** - Primary programming language
- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Service management

### Database
- **MySQL** - Relational database
- **Cloud hosting** - High availability and scalability
- **Data Transfer Objects (DTOs)** - Efficient data exchange

## 🧠 Smart Algorithms

### 1. Blood Donor Ranking Algorithm
Ranks eligible donors using weighted scoring:
- **Proximity Score (50% weight)**: Distance from hospital
- **Recency Score (30% weight)**: Time since last donation (90-365 days)
- **Age Score (20% weight)**: Donor age optimization (18-37 years)

```
Total Score = 0.5 × Proximity + 0.3 × Recency + 0.2 × Age
```

### 2. Blood Request Prioritization Algorithm
Prioritizes requests based on urgency:
- **High Priority**: Accidents, surgery complications (Priority = 1)
- **Medium Priority**: Pregnancy (Priority = 2)
- **Low Priority**: Planned surgery (Priority = 3)

## 📊 Performance Metrics

- **94.7% reduction** in average matching time (32 hours → 1.7 hours)
- **89% accuracy** in optimal donor matching
- **93% accuracy** for urgent cases
- **Coverage**: 77 districts and 57 local governments

## 🔧 Installation & Setup

### Prerequisites
- .NET 8 SDK
- Node.js and npm
- MySQL Server
- Git

### Backend Setup
```bash
# Clone the repository
git clone 
cd blood-donation-backend

# Restore NuGet packages
dotnet restore

# Update database connection string in appsettings.json
# Run database migrations
dotnet ef database update

# Start the backend server
dotnet run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd blood-donation-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Configuration
Create `.env` files for both frontend and backend with necessary configurations:
- Database connection strings
- API endpoints
- Authentication keys

## 🗃️ Database Schema

Key entities and relationships:
- **Users**: Authentication and role management
- **Hospitals**: Central hub for operations
- **Donors**: Personal information and donation history
- **Inventory**: Blood supply tracking
- **PatientWaitlist**: Request management and matching

## 🔐 Security Features

- **Password Security**: SHA-256 hashing with random salt
- **API Authentication**: Key-based request validation
- **Role-based Access Control**: Granular permission management
- **Data Encryption**: Secure data transmission
- **Input Validation**: Protection against common attacks

## 🌍 Geographic Features

### NepalCoordinates Module
- **Offline Functionality**: Local storage of all Nepalese administrative coordinates
- **Distance Calculations**: Haversine formula for accurate proximity
- **Rural Accessibility**: Critical operations work without internet connectivity

## 🧪 Testing Strategy

### Unit Testing
- Individual component validation
- Algorithm accuracy testing
- Database operation verification

### System Testing
- End-to-end workflow validation
- Integration testing between components
- User interface functionality testing

### Test Coverage Areas
- User authentication and authorization
- Donor-patient matching algorithms
- Database CRUD operations
- API endpoint functionality

## 📈 Future Enhancements

### Technical Roadmap
- **Mobile Application**: Native mobile app for donors and field workers
- **AI Integration**: Machine learning for predictive analytics
- **Blockchain**: Secure data tracking and transparency
- **SMS Integration**: Automated notifications
- **Self-registration**: User-initiated account creation

### Scalability Plans
- **National Deployment**: Expand to all districts
- **Cross-border Integration**: Regional coordination
- **International Networks**: Global blood donation connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is developed as part of academic research for Bachelor's in Computer Science and Information Technology at Tribhuvan University.

## 🔗 Related Links

- [Frontend source code](https://github.com/samikshakhadka/BloodTransfusionManagementSystem-Client)
- [Backend Source Code](https://github.com/samikshakhadka/BloodTransfusionManagementSystem-Server)
- [Project Report](https://github.com/samikshakhadka/BloodTransfusionManagementSystem-Server/blob/main/Blood%20Donation%20Management%20System%20using%20weighted%20scoring%20Model%20(1).pdf)

---

**Note**: This system addresses critical healthcare challenges in Nepal and demonstrates the application of advanced software engineering principles to real-world problems with significant social impact.
