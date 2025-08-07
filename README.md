# Movie Analysis System based on SQL queries  🎬

A beginner-friendly interactive web application for learning SQL fundamentals through movie dataset analysis. Practice essential SQL concepts like SELECT, JOIN, GROUP BY, and aggregations without complex features.

![Movie Analysis Project](https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🎯 Project Goals

- **Learn SQL Fundamentals**: Master basic SQL queries through hands-on practice
- **Real Dataset Analysis**: Work with realistic movie data including titles, genres, and ratings
- **Interactive Learning**: Execute queries instantly and see results in real-time
- **Beginner-Friendly**: No complex SQL features - focus on core concepts
- **Export Capabilities**: Download query results as CSV files for further analysis

## 🗂️ Database Schema

The project uses a simple 3-table SQLite database:

### 1. `movies` Table
| Column | Type | Description |
|--------|------|-------------|
| movie_id | INTEGER | Primary key |
| title | TEXT | Movie title |
| year | INTEGER | Release year |
| language | TEXT | Primary language |
| duration | INTEGER | Runtime in minutes |

### 2. `genres` Table
| Column | Type | Description |
|--------|------|-------------|
| movie_id | INTEGER | Foreign key to movies |
| genre | TEXT | Genre name (Sci-Fi, Action, etc.) |

### 3. `ratings` Table
| Column | Type | Description |
|--------|------|-------------|
| rating_id | INTEGER | Primary key |
| movie_id | INTEGER | Foreign key to movies |
| user_id | INTEGER | User identifier |
| rating | REAL | Rating score (0-10) |

## 🔧 Featured SQL Queries

### Beginner Level
- **List All Movies**: Basic SELECT statement
- **Find Sci-Fi Movies**: Simple JOIN with WHERE clause
- **Movies After 2010**: Date filtering with WHERE
- **Long Movies by Language**: Multi-condition filtering

### Intermediate Level
- **Average Rating per Movie**: JOIN with AVG aggregation
- **Top 5 Highest-Rated Movies**: Complex query with LIMIT
- **Movies by Genre Count**: GROUP BY with COUNT

### Advanced Level
- **Genre Distribution Analysis**: Advanced aggregation with percentage calculations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-analysis-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start exploring!

## 🎮 How to Use

### 1. Database Initialization
The SQLite database automatically initializes with sample data when you load the application. You'll see a confirmation when it's ready.

### 2. Running Preset Queries
- Browse the **Preset Queries** tab
- Each query shows difficulty level and description
- Click **Execute** to run any query
- Results appear instantly in the Results Panel

### 3. Writing Custom Queries
- Switch to the **Custom Query** tab
- Write your own SQL in the text area
- Click **Execute Custom Query** to run it
- Perfect for experimenting and learning!

### 4. Viewing Results
- Results display in a clean table format
- Export any results to CSV format
- View query execution time and row count
- See the exact SQL that was executed

### 5. Dataset Statistics
The Stats Panel shows:
- Total movies and genres in database
- Average rating across all movies
- Most popular genre
- Newest/oldest movies
- Longest/shortest movies

## 📊 Sample Data

The project includes 15 popular movies with realistic data:
- **Inception** (2010) - Sci-Fi, Action, Thriller
- **The Dark Knight** (2008) - Action, Crime, Drama
- **Parasite** (2019) - Thriller, Drama
- **Spirited Away** (2001) - Animation, Family
- And many more...

Each movie has multiple user ratings and genre classifications for comprehensive analysis practice.

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Database**: SQLite with SQL.js (runs entirely in browser)
- **Icons**: Lucide React for beautiful, consistent icons
- **Build Tool**: Vite for fast development and building

## 📚 Learning Outcomes

After completing this project, you'll understand:

| SQL Concept | Description | Used In |
|-------------|-------------|---------|
| **SELECT** | Retrieve data from tables | All basic queries |
| **WHERE** | Filter data with conditions | Movie filtering, date ranges |
| **JOIN** | Combine data from multiple tables | Movies + genres, movies + ratings |
| **GROUP BY** | Group rows for aggregation | Genre counts, movie statistics |
| **COUNT()** | Count rows in groups | Genre popularity |
| **AVG()** | Calculate averages | Movie ratings |
| **ORDER BY** | Sort results | Top-rated movies, chronological |
| **LIMIT** | Restrict number of results | Top N queries |

## 🎨 Features

### Interactive Interface
- **Dark Theme**: Professional appearance with excellent readability
- **Syntax Highlighting**: SQL queries displayed with proper formatting
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Execution**: Instant query results with loading indicators

### Data Export
- **CSV Export**: Download any query results
- **Formatted Output**: Clean, spreadsheet-ready data
- **Timestamp Tracking**: Know when queries were executed

### Educational Tools
- **Difficulty Levels**: Queries marked as Beginner/Intermediate/Advanced
- **Query Descriptions**: Understand what each query demonstrates
- **Error Handling**: Clear error messages for learning from mistakes

## 🔄 Extending the Project

### Add More Data
```sql
-- Add more movies
INSERT INTO movies (movie_id, title, year, language, duration) 
VALUES (16, 'Your Movie', 2023, 'English', 120);

-- Add genres
INSERT INTO genres (movie_id, genre) 
VALUES (16, 'Drama');

-- Add ratings
INSERT INTO ratings (rating_id, movie_id, user_id, rating) 
VALUES (61, 16, 105, 8.5);
```

### Create New Query Categories
- Add user behavior analysis
- Implement movie recommendation queries
- Create time-series analysis for movie trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Sample movie data inspired by popular films
- Built with modern web technologies for optimal learning experience
- Designed for SQL beginners and educators

---

**Happy Learning! 🎓**

Start your SQL journey by exploring movie data and discovering insights through interactive queries. Perfect for students, bootcamp participants, and anyone wanting to master SQL fundamentals.
