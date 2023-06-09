import React from "react";
import common from "../common";
/**
 * 
 * @param {*} props 
 * x,y: 坐标
 * type: 类型 B: blank, W: wall, S: snake, FP: food plus, FM: food minus, FE: food eraser,  
 * @returns 
 */
export default function Square(props) {
    // console.log("square :", props.key)
    let color = '';
    let text = '';
    let textColor = '';
    let headerText = '→';
    switch (props.direction) {
        case common.DIRECTION.DOWN: headerText = '↓'; break;
        case common.DIRECTION.UP: headerText = '↑'; break;
        case common.DIRECTION.LEFT: headerText = '←'; break;
        case common.DIRECTION.RIGHT: headerText = '→'; break;
        default: break;
    }
    switch (props.type) {
        case common.CTYPE.SNAKE: color = '#525252';break;
        case common.CTYPE.SNAKE_HEADER: color = 'black';textColor = 'white';text = headerText;break;
        case common.CTYPE.SNAKE_PREGNANT: color = 'black';break;
        case common.CTYPE.FUCKED_SNAKE: color = 'red';break;
        case common.CTYPE.WALL: color = 'blue';break;
        case common.CTYPE.FOOD_PLUS: color = 'yellow'; text = '+'; break;
        case common.CTYPE.FOOD_MINUS: color = 'red'; textColor = 'white';text = '-'; break;
        case common.CTYPE.FOOD_ERASER: color = '#555'; textColor = 'white'; text = 'E'; break;
        case common.CTYPE.FOOD_S_UP: color = '#999'; textColor = 'white';text = 'U'; break;
        case common.CTYPE.FOOD_S_DOWN: color = '#bbb'; textColor = 'white';text = 'D'; break;
        default:
            break;
        }
    let style = color?{backgroundColor:color,opacity:1}:{};
    if(props.flash){
        style = {backgroundColor:'blue',opacity:0.2}
    }
    const style2 = textColor? {color:textColor}: {};
    // console.log(`Square ${JSON.stringify(style)}`);
    return (
        <div className="square" onClick={props.onClick} style={style}>
            <span style={style2}>{text}</span>
        </div>
    );
}