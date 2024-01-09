# Project README

## Node.js Project

### Running the Node.js Project

1. Open a terminal.
2. Navigate to the Node.js project directory.
   ```bash
   cd SKYLIT/node_project
   ```
3. Install project dependencies.
   ```bash
   npm install
   ```
4. Open `index.js` and add your database credentials.
   ```javascript
   // index.js
   const dbConfig = {
     host: "your_database_host",
     user: "your_database_user",
     password: "your_database_password",
     database: "your_database_name",
   };
   ```
5. Save the changes and run the project.
   ```bash
   npm run start
   ```
6. The Node.js project will be accessible at http://localhost:3000.

## Navigate to Flask

### Running the Python Project

1. Open a new terminal.
2. Navigate to the Python project directory.
   ```bash
   cd SKYLIT/flask
   ```
3. Install project dependencies.
   ```bash
   pip install -r requirements.txt
   ```
4. Save the changes and run the project.
   ```bash
   python heatmap.py
   ```
5. The Python project will be accessible at http://localhost:5000.

## Executing `run.bat` in thetaData Folder

1. Open a terminal.
2. Navigate to the `thetaData` folder.
   ```bash
   cd SKYLIT/thetaData
   ```
3. Execute the `run.bat` file.
   ```bash
   run.bat
   ```
4. The script in `run.bat` will be executed.

Note: Ensure that Node.js, npm, and Python are installed on your system before running the projects. You may need to modify database credentials, file paths, or other configurations based on your project structure.

Feel free to customize the instructions based on your specific project details and requirements.

```

```
