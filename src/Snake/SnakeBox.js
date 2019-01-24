import React, { Component } from "react";
import PropTypes from "prop-types";
import "./SnakeBox.css";

export default class SnakeBox extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let className = "box";
        if (this.props.isSnakeHead) {
            className += " snakeHead";
        } else if (this.props.isSnakeElement) {
            className += " snakeElement";
        }
        if (this.props.isFoodElement) {
            className += " food";
        }

        return <div className={className} />;
    }
}

SnakeBox.propTypes = {
    isSnakeElement: PropTypes.bool,
    isFoodElement: PropTypes.bool,
    isSnakeHead: PropTypes.bool
};
