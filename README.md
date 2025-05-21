Hello Everyone....! Please read before you run this project.
This is the Project Structure:- 
Vaidyakiya Sahayaka/
├── client/vaid-app    # React frontend
├── server/            # Express backend
└── README.md

Before you start you need this in local system
Requirements:-
-  Node.js (v14 or higher recommended)
-  MySQL Server
-  npm

Installation & Setup
Clone the repository:
git clone https://github.com/your-username/your-repo-name.git
cd "Vaidyakiya Sahayaka"

There will be one file vaid.sql
open that file in mysql workbench inside execute all tables and insert some data if you needed.

Inside server.js , there will be codes to connect with database, you have to write your database details there,
const db = mysql.createConnection({
    host: <YOUR_HOST>,
    user: <YOUR_USER_NAME>,
    password: <YOUR_PASSWORD>,
    database: <YOUR_DATABASE_NAME>
});

Now open any code editor 
Open vscode :-
open terminal follow the commands:-
cd Vaidyakiya Sahayaka
cd client
cd vaid-app
npm install

open another terminal follow the commands:-
cd Vaidyakiya Sahayaka
cd server
npm install

Start frontend React app:
npm start

Start backend server:
node server.js
