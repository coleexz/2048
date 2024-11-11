# 2048 Game Project

This project implements the popular 2048 game, designed specifically for showcasing at an event promoting the student council slate for the **Computer Systems Engineering, Data Science and Artificial Intelligence Engineering, and Telecommunications Engineering** programs at college.

## Game Description

2048 is a puzzle game in which the player combines numbers to reach the goal of creating a tile with the value of 2048. This project recreates the game with a modern interface, a scoring system, and a leaderboard that allows saving and displaying high scores.

## Features

- **Tile Movement**: Tiles can move in four directions (up, down, left, right) to combine numbers.
- **Leaderboard**: Player scores are saved in a database and displayed on a sorted leaderboard.
- **Leaderboard Pagination**: If there are more than five entries in the leaderboard, you can navigate between pages to see all the scores.
  
## Requirements

- **Live Server** in **Visual Studio Code**: To play, you need to run the project on a live server. The easiest way to do this is by using the **Live Server** extension in VS Code. Make sure you have the extension installed, and from the `index.html` file, right-click and select **"Open with Live Server"**.

- **Node.js and Express**: The project's backend is built with Node.js and Express to handle the leaderboard and save scores in an SQLite database.

## Installation and Execution

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/2048-game.git
   cd 2048-game
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

4. Open `index.html` with **Live Server** in Visual Studio Code to load the game in your browser.

## Usage

- Use the arrow keys to move tiles and add up the numbers.
- At the end of the game, you can enter your name and Instagram handle to save your score to the leaderboard.
- Navigate through the leaderboard using the pagination buttons to view all scores.

## Technologies Used

- **HTML, CSS, JavaScript** for the frontend.
- **Node.js and Express** for the backend.
- **SQLite** for storing scores.

## Contributions

If you'd like to enhance or customize the game, feel free to fork the project and submit pull requests.
