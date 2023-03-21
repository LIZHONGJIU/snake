import React from "react";
import Square from "./Square";
import common from "../common";

export default class Board extends React.Component {
    renderSquare(x, y) {
        let type = common.CTYPE.BLANK;
        let flash = false;

        type = this.props.others?.find(a => a.x === x && a.y === y)?.t ?? common.CTYPE.BLANK;
        // console.log(`renderSquare ${type} - ${JSON.stringify(this.props.food?.find(a => a.x === x && a.y === y)?.t)}`)
        type = this.props.snake?.find(a => a.x === x && a.y === y)?.t ?? type;

        if(type === common.CTYPE.SNAKE){
            if(this.props.snake.length === common.SNAKE_MAX_LENGTH - 1){
                type = common.CTYPE.SNAKE_PREGNANT;
            }
            if(this.props.snake[0].x === x && this.props.snake[0].y === y){
                type = common.CTYPE.SNAKE_HEADER;
            }
        }

        if(this.props.flash 
            && x >= this.props.flash.x1 && x <= this.props.flash.x2
            && y >= this.props.flash.y1 && y <= this.props.flash.y2){
                flash = true;
        }
        return (
            <Square
                key={x * common.COLUMN_COUNT + y}
                type={type}
                flash={flash}
            />
        );
    }

    render() {
      
        let count = Array.from(Array(common.COLUMN_COUNT), (_,x) => x);

        return (
            <div>
                {
                  count.map((_, idx) => {
                    return (
                    <div className="board-row">
                      {count.map((_, idx2) => this.renderSquare(idx2, idx))}
                    </div>)
                    ;
                  }
                  )
                }
            </div>
        );
    }
}