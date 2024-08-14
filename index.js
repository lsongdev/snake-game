const GRID_SIZE = 15;
const CELL_SIZE = 25;
const INITIAL_SNAKE = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 }
];
const INITIAL_FOOD = { x: 11, y: 11 };
const INITIAL_DIRECTION = 'RIGHT';

class SnakeGame {
  constructor() {
    this.snake = [...INITIAL_SNAKE];
    this.food = { ...INITIAL_FOOD };
    this.direction = INITIAL_DIRECTION;
    this.gameOver = false;
    this.score = 0;
    this.debug = '游戏开始';

    this.app = document.getElementById('app');
    this.setupGame();
    this.bindEvents();
    this.gameLoop = setInterval(() => this.moveSnake(), 200);
  }

  setupGame() {

    this.gameBoard = document.getElementById('game-board');
    this.gameBoard.style.width = `${GRID_SIZE * CELL_SIZE}px`;
    this.gameBoard.style.height = `${GRID_SIZE * CELL_SIZE}px`;
    this.gameBoard.style.position = 'relative';
    this.gameBoard.style.backgroundColor = 'white';
    this.gameBoard.style.border = '1px solid black';

    this.drawGrid();
    this.drawSnake();
    this.drawFood();
  }

  drawGrid() {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const cell = document.createElement('div');
        cell.style.position = 'absolute';
        cell.style.left = `${j * CELL_SIZE}px`;
        cell.style.top = `${i * CELL_SIZE}px`;
        cell.style.width = `${CELL_SIZE}px`;
        cell.style.height = `${CELL_SIZE}px`;
        cell.style.border = '1px solid #eee';
        this.gameBoard.appendChild(cell);
      }
    }
  }

  drawSnake() {
    this.snake.forEach((segment, index) => {
      const snakeSegment = document.createElement('div');
      snakeSegment.style.position = 'absolute';
      snakeSegment.style.left = `${segment.x * CELL_SIZE}px`;
      snakeSegment.style.top = `${segment.y * CELL_SIZE}px`;
      snakeSegment.style.width = `${CELL_SIZE - 2}px`;
      snakeSegment.style.height = `${CELL_SIZE - 2}px`;
      snakeSegment.style.backgroundColor = index === 0 ? 'red' : 'green';
      snakeSegment.style.border = '1px solid black';
      snakeSegment.style.zIndex = '10';
      this.gameBoard.appendChild(snakeSegment);
    });
  }

  drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.position = 'absolute';
    foodElement.style.left = `${this.food.x * CELL_SIZE}px`;
    foodElement.style.top = `${this.food.y * CELL_SIZE}px`;
    foodElement.style.width = `${CELL_SIZE}px`;
    foodElement.style.height = `${CELL_SIZE}px`;
    foodElement.style.backgroundColor = 'red';
    foodElement.style.borderRadius = '50%';
    foodElement.style.zIndex = '10';
    this.gameBoard.appendChild(foodElement);
  }

  moveSnake() {
    if (this.gameOver) return;

    const newSnake = [...this.snake];
    const head = { ...newSnake[0] };

    switch (this.direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      this.endGame('游戏结束：撞墙');
      return;
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.endGame('游戏结束：自噬');
      return;
    }

    newSnake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 1;
      this.updateFood();
      this.updateDebug('吃到食物！');
    } else {
      newSnake.pop();
    }

    this.snake = newSnake;
    this.updateGame();
  }

  updateFood() {
    this.food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }

  updateGame() {
    this.gameBoard.innerHTML = '';
    this.drawGrid();
    this.drawSnake();
    this.drawFood();
    this.updateScore();
    this.updateDirection();
    this.updateSnakePosition();
  }

  updateScore() {
    document.getElementById('score').textContent = `分数: ${this.score}`;
  }

  updateDirection() {
    this.updateDebug(`方向：${this.direction}`);
  }

  updateDebug(message) {
    this.debug = message;
    console.debug(this.debug);
  }

  updateSnakePosition() {
    this.updateDebug(`蛇位置：${this.snake[0].x},${this.snake[0].y}`);
  }

  endGame(reason) {
    this.gameOver = true;
    clearInterval(this.gameLoop);
    this.updateDebug(reason);
    document.getElementById('game-over').style.display = 'block';
  }

  restartGame() {
    this.snake = [...INITIAL_SNAKE];
    this.food = { ...INITIAL_FOOD };
    this.direction = INITIAL_DIRECTION;
    this.gameOver = false;
    this.score = 0;
    this.updateDebug('游戏重新开始');
    document.getElementById('game-over').style.display = 'none';
    this.updateGame();
    this.gameLoop = setInterval(() => this.moveSnake(), 200);
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': this.direction = 'UP'; this.updateDebug('按下：上'); break;
        case 'ArrowDown': this.direction = 'DOWN'; this.updateDebug('按下：下'); break;
        case 'ArrowLeft': this.direction = 'LEFT'; this.updateDebug('按下：左'); break;
        case 'ArrowRight': this.direction = 'RIGHT'; this.updateDebug('按下：右'); break;
      }
    });
    document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SnakeGame();
});