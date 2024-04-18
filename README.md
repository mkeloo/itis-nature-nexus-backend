# itis-nature-nexus-backend

Google Doc For 5 Complex Queries: [LINK:](https://docs.google.com/document/d/1C_6i9Mzdmzy1009HQfd19PyyQo_rHkEit9O_QogxLaE/edit?usp=sharing)
## DO NOT MERGE WITH MAIN SINCE TABLES NAMES ARE PREPENDED -- THIS BRANCH IS FOR REFERENCE ONLY

## ensure to include <username.>TABLE_NAME for queries

## Steps to test the backend App:

### 1. clone the repo:
```
git clone https://github.com/mkeloo/itis-nature-nexus-backend.git
``` 

### 2. Install Dependencies using npm:
```
npm install
``` 

NOTE: if u wanna use Nodemon then here's the [LINK](https://www.npmjs.com/package/nodemon)

### 3. Set Up Environment Variables:
Before starting the server, make sure to set up the necessary environment variables. Create a .env file in the root of your project directory and include all the necessary keys:
```
ORACLE_DB_USER=username
ORACLE_DB_PASSWORD=password
ORACLE_DB_CONNECTION_STRING=connection_string
``` 

### 4. Start the Application:
Run the application using Node.js. This command will start the server:
```
node app.js
``` 
You should see a message indicating that the server is running, typically on http://localhost:3000.


### 5. Test API Endpoints:
Open a web browser or use a tool like Postman to test the API endpoints. Here are the links you can use to access the different queries, assuming the server is running on localhost port 3000:

1. Query 1 (Bird Observations and Climate Variations Correlation):
```
http://localhost:3000/api/query1
``` 

2. Query 2 (Enhanced Diversity Index with Climate Data Integration):
```
http://localhost:3000/api/query2
``` 

3. Query 3 (Year-over-Year Growth Rate in Species Observations):
```
http://localhost:3000/api/query3
``` 

4. Query 4 (Bird Population Dynamics Trends):
```
http://localhost:3000/api/query4
``` 

5. Query 5 (Regional Taxonomic Diversity and Conservation Priorities):
```
http://localhost:3000/api/query5
``` 

