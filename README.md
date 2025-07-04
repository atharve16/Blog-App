# 📝 Blogify

**Blogify** is a full-stack blog publishing platform that allows users to create, read, update, and delete blog posts. It supports user authentication, a responsive UI, and integrates secure REST APIs for seamless backend communication.

---

## 🚀 Features

- ✍️ Create, Edit, Delete Blogs  
- 👥 User Authentication & Authorization (JWT-based)  
- 📚 Paginated Blog Listing  
- 🔍 Search & Filter Blogs  
- 📈 Trending & Popular Tags  
- 📱 Fully Responsive Design  
- 🔐 Secured Backend APIs  
- ⚙️ Admin Role Support *(optional)*

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Context API for state management
- Axios for API calls
- Lucide-react for icons
- Tailwind CSS / MUI / Custom Styling

### Backend:
- Java Spring Boot
- Spring Security for Authentication
- JPA + Hibernate
- MongoDB / H2 (configurable)
- JWT Token-based Authentication

---

## 📦 Installation

### Clone the repository
```bash
git clone https://github.com/your-username/blogify.git
cd blogify

cd frontend
npm install
npm start

cd backend
mvn clean install
# Run via IDE or
java -jar target/blogify-0.0.1-SNAPSHOT.jar

| Method | Endpoint          | Description   |
| ------ | ----------------- | ------------- |
| POST   | `/api/auth/login` | Login user    |
| POST   | `/api/blogs`      | Create a blog |
| GET    | `/api/blogs`      | Get all blogs |
| PUT    | `/api/blogs/{id}` | Update a blog |
| DELETE | `/api/blogs/{id}` | Delete a blog |


spring.datasource.url=YOUR_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

