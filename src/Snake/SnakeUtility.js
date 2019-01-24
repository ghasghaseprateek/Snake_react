export function GetKeyArray(snake_x_Array, snake_y_Array) {
    let snake_key_array = [];
    for (let i = 0; i < snake_x_Array.length; i++) {
        let key = "x" + snake_x_Array[i] + "_y" + snake_y_Array[i];
        snake_key_array.push(key);
    }
    return snake_key_array;
}

export const GameStatuses = {
    Start: "start",
    InProgress: "inProgress",
    End: "end"
};

export const GameRules = {
    SelfTouch: "selfTouch",
    NewFood: "newFood",
    IncreaseSnakeLength: "increaseSnakeLength"
};

export const SnakeDirections = {
    Left: "left",
    Up: "up",
    Right: "right",
    Down: "down"
};
