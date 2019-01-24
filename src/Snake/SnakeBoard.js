import React, { Component } from "react";
import SnakeBox from "./SnakeBox.js";
import { GetKeyArray, GameStatuses, GameRules, SnakeDirections } from "./SnakeUtility.js";
import "./SnakeBoard.css";

export default class SnakeBoard extends Component {
    directionRule = SnakeDirections.Right;
    commonRules = [GameRules.SelfTouch, GameRules.NewFood, GameRules.IncreaseSnakeLength];
    delay = 100;
    gameStatus = GameStatuses.Start;
    newFoodkey = "";
    score = 0;

    constructor(props) {
        super(props);

        this.state = {
            snake_x_Array: [8, 7, 6, 5, 4, 3, 2, 1, 0],
            snake_y_Array: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            snake_key_array: []
        };

        this.startButtonClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", e => this.handleKeyPress(e));

        this.setState({
            snake_key_array: GetKeyArray(this.state.snake_x_Array, this.state.snake_y_Array)
        });
    }

    executeRules() {
        let snake_x_Array = this.state.snake_x_Array.slice();
        let snake_y_Array = this.state.snake_y_Array.slice();
        let commonRules = this.commonRules.slice();
        let isGameEnded = false;
        let key;

        let snake_x_tailElement = snake_x_Array.pop();
        let snake_y_tailElement = snake_y_Array.pop();

        switch (this.directionRule) {
            case SnakeDirections.Left:
                snake_x_Array.splice(0, 0, snake_x_Array[0] === 0 ? 49 : snake_x_Array[0] - 1);
                snake_y_Array.splice(0, 0, snake_y_Array[0]);
                break;
            case SnakeDirections.Up:
                snake_x_Array.splice(0, 0, snake_x_Array[0]);
                snake_y_Array.splice(0, 0, snake_y_Array[0] === 0 ? 49 : snake_y_Array[0] - 1);
                break;
            case SnakeDirections.Right:
                snake_x_Array.splice(0, 0, snake_x_Array[0] === 49 ? 0 : snake_x_Array[0] + 1);
                snake_y_Array.splice(0, 0, snake_y_Array[0]);
                break;
            case SnakeDirections.Down:
                snake_x_Array.splice(0, 0, snake_x_Array[0]);
                snake_y_Array.splice(0, 0, snake_y_Array[0] === 49 ? 0 : snake_y_Array[0] + 1);
                break;
            default:
                break;
        }

        this.commonRules.forEach(rule => {
            switch (rule) {
                case GameRules.SelfTouch:
                    let snake_key_array = [];
                    for (let i = 0; i < snake_x_Array.length; i++) {
                        let key = "x" + snake_x_Array[i] + "_y" + snake_y_Array[i];
                        if (snake_key_array.includes(key)) {
                            isGameEnded = true;
                        } else {
                            snake_key_array.push(key);
                        }
                    }
                    break;
                case GameRules.NewFood:
                    do {
                        let x = Math.floor(Math.random() * 50);
                        let y = Math.floor(Math.random() * 50);
                        key = "x" + x + "_y" + y;
                    } while (this.state.snake_key_array.includes(key));
                    commonRules.splice(commonRules.indexOf(GameRules.NewFood), 1);
                    break;
                case GameRules.IncreaseSnakeLength:
                    if (this.newFoodkey === this.state.snake_key_array[0]) {
                        snake_x_Array.push(snake_x_tailElement);
                        snake_y_Array.push(snake_y_tailElement);
                        commonRules.push(GameRules.NewFood);
                        this.score += 1;
                        if (this.delay > 5) {
                            this.delay = this.delay - 5;
                        }
                    }
                    break;
                default:
                    break;
            }
        });

        this.commonRules = commonRules;
        this.newFoodkey = key !== undefined && key !== "" ? key : this.newFoodkey;
        this.gameStatus = isGameEnded && GameStatuses.End;

        this.setState({
            snake_y_Array: snake_y_Array,
            snake_x_Array: snake_x_Array,
            snake_key_array: GetKeyArray(snake_x_Array, snake_y_Array)
        });

        this.interval = !isGameEnded && setTimeout(() => this.executeRules(), this.delay);
    }

    handleKeyPress(e) {
        switch (e.keyCode) {
            // left
            case 37:
                if (
                    this.directionRule === SnakeDirections.Up ||
                    this.directionRule === SnakeDirections.Down
                ) {
                    this.directionRule = SnakeDirections.Left;
                }
                break;
            //up
            case 38:
                if (
                    this.directionRule === SnakeDirections.Left ||
                    this.directionRule === SnakeDirections.Right
                ) {
                    this.directionRule = SnakeDirections.Up;
                }
                break;
            //right
            case 39:
                if (
                    this.directionRule === SnakeDirections.Up ||
                    this.directionRule === SnakeDirections.Down
                ) {
                    this.directionRule = SnakeDirections.Right;
                }
                break;
            //down
            case 40:
                if (
                    this.directionRule === SnakeDirections.Left ||
                    this.directionRule === SnakeDirections.Right
                ) {
                    this.directionRule = SnakeDirections.Down;
                }
                break;
            default:
                break;
        }
    }

    GetAllSnakeBoxes() {
        let allBoxes = [];
        let x_boxes = 50;
        let y_boxes = 50;

        for (let i = 0; i < y_boxes; i++) {
            for (let j = 0; j < x_boxes; j++) {
                let key = "x" + j + "_y" + i;
                let isSnakeElement = false;
                let isSnakeHead = false;
                let isFoodElement = false;

                if (this.state.snake_key_array.includes(key)) {
                    if (this.state.snake_key_array[0] === key) {
                        isSnakeHead = true;
                    }
                    isSnakeElement = true;
                }
                if (key === this.newFoodkey) {
                    isFoodElement = true;
                }
                allBoxes.push(
                    <SnakeBox
                        key={key}
                        isSnakeElement={isSnakeElement}
                        isFoodElement={isFoodElement}
                        isSnakeHead={isSnakeHead}
                    />
                );
            }
        }
        return allBoxes;
    }

    startButtonClick = () => {
        this.gameStatus = GameStatuses.InProgress;
        this.interval = setTimeout(() => this.executeRules(), this.delay);
    };

    render() {
        if (this.gameStatus === GameStatuses.Start) {
            return (
                <div>
                    <button className="startButton" onClick={this.startButtonClick}>
                        Start
                    </button>
                </div>
            );
        } else if (this.gameStatus === GameStatuses.End) {
            return (
                <div className="finalScoreBoard">
                    <h1>Your score</h1>
                    <h3>{this.score}</h3>
                </div>
            );
        } else {
            return (
                <div className="snakeBoard">
                    <div className="score">
                        <h3>{this.score}</h3>
                    </div>
                    {this.GetAllSnakeBoxes()}
                </div>
            );
        }
    }
}
