import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
const CTYPE = {
    BLANK: 'B',
    WALL: 'W',
    SNAKE: 'S',
    SNAKE_HEADER: 'SH',
    SNAKE_PREGNANT: 'SP',
    FUCKED_SNAKE: 'FS',
    FOOD_PLUS: 'FP',
    FOOD_MINUS: 'FM',
    FOOD_ERASER: 'FE',
    FOOD_S_UP: 'FSU',
    FOOD_S_DOWN: 'FSD'
}

const FOOD_LIST= [
    CTYPE.FOOD_PLUS, 
    CTYPE.FOOD_MINUS, 
    CTYPE.FOOD_ERASER, 
    CTYPE.FOOD_S_UP, 
    CTYPE.FOOD_S_DOWN
];

// const FOOD_LIST1 = [CTYPE.FOOD_ERASER, CTYPE.FOOD_ERASER, CTYPE.FOOD_ERASER];
const FOOD_LIST1 = [CTYPE.FOOD_PLUS, CTYPE.FOOD_PLUS, CTYPE.FOOD_PLUS, CTYPE.FOOD_S_UP];
const FOOD_LIST2 = [CTYPE.FOOD_PLUS, CTYPE.FOOD_ERASER, CTYPE.FOOD_S_UP, CTYPE.FOOD_S_DOWN];
const FOOD_LIST3 = [CTYPE.FOOD_MINUS, CTYPE.FOOD_ERASER, CTYPE.FOOD_S_UP, CTYPE.FOOD_S_DOWN];

const DIRECTION = {
    UP: 'U',
    DOWN: 'D',
    LEFT: 'L',
    RIGHT: 'R'
}
const STATUS = {
    FUCKED: 'F',
    RUNNING: 'R'
}

const COLUMN_COUNT = 35;
const FOOD_COUNT = 5;   
const SPEED = 200;
const SNAKE_MAX_LENGTH = 20; //SNAKE MAX LENGTH,
const SNAKE_MIN_LENGTH = 5; //SNAKE MIN LENGTH
const FOOD_MAX_COUNT = 15;
const FOOD_MIN_COUNT = 3;

const DEFAULT_STATE = {
    snake: [{x:3,y:0,t:CTYPE.SNAKE}, {x:2,y:0,t:CTYPE.SNAKE}, {x:1,y:0,t:CTYPE.SNAKE}, {x:0,y:0,t:CTYPE.SNAKE}],
    // others: [{x:2,y:7,t:CTYPE.FOOD_PLUS},{x:5,y:7,t:CTYPE.FOOD_PLUS},{x:7,y:3,t:CTYPE.FOOD_MINUS}],
    others: [],
    flash: [],
    direction: DIRECTION.RIGHT,
    started: false,
    status: STATUS.RUNNING,
    foodCount: FOOD_COUNT,
    speed: SPEED,
    lastFood: '',
    score: 0,
    directionPool: [DIRECTION.RIGHT],
}
/**
 * 
 * @param {*} props 
 * x,y: 坐标
 * type: 类型 B: blank, W: wall, S: snake, FP: food plus, FM: food minus, FE: food eraser,  
 * @returns 
 */
function Square(props) {
    let color = '';
    let text = '';
    let textColor = '';
    switch (props.type) {
        case CTYPE.SNAKE: color = '#525252';break;
        case CTYPE.SNAKE_HEADER: color = 'black';textColor = 'white';text = 'H';break;
        case CTYPE.SNAKE_PREGNANT: color = 'black';break;
        case CTYPE.FUCKED_SNAKE: color = 'red';break;
        case CTYPE.WALL: color = 'blue';break;
        case CTYPE.FOOD_PLUS: color = 'yellow'; text = '+'; break;
        case CTYPE.FOOD_MINUS: color = 'red'; textColor = 'white';text = '-'; break;
        case CTYPE.FOOD_ERASER: color = '#555'; textColor = 'white'; text = 'E'; break;
        case CTYPE.FOOD_S_UP: color = '#999'; textColor = 'white';text = 'U'; break;
        case CTYPE.FOOD_S_DOWN: color = '#bbb'; textColor = 'white';text = 'D'; break;
        default:
            break;
        }
    let style = color?{backgroundColor:color,opacity:1}:{};
    if(props.flash){
        style = {backgroundColor:'blue',opacity:0.5}
    }
    const style2 = textColor? {color:textColor}: {};
    // console.log(`Square ${JSON.stringify(style)}`);
    return (
        <button className="square" onClick={props.onClick} style={style}>
            <span style={style2}>{text}</span>
        </button>
    );
}

class Board extends React.Component {
    renderSquare(x, y) {
        let type = CTYPE.BLANK;
        let flash = false;

        type = this.props.others?.find(a => a.x === x && a.y === y)?.t ?? CTYPE.BLANK;
        // console.log(`renderSquare ${type} - ${JSON.stringify(this.props.food?.find(a => a.x === x && a.y === y)?.t)}`)
        type = this.props.snake?.find(a => a.x === x && a.y === y)?.t ?? type;

        if(type === CTYPE.SNAKE){
            if(this.props.snake.length === SNAKE_MAX_LENGTH - 1){
                type = CTYPE.SNAKE_PREGNANT;
            }
            if(this.props.snake[0].x === x && this.props.snake[0].y === y){
                type = CTYPE.SNAKE_HEADER;
            }
        }

        if(this.props.flash 
            && x >= this.props.flash.x1 && x <= this.props.flash.x2
            && y >= this.props.flash.y1 && y <= this.props.flash.y2){
                flash = true;
        }
        return (
            <Square
                key={x * COLUMN_COUNT + y}
                type={type}
                flash={flash}
            />
        );
    }

    render() {
      
        let count = Array.from(Array(COLUMN_COUNT), (_,x) => x);

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

class Game extends React.Component {
    constructor(props) {
        super(props);
        const history = [{},{}];
        this.state = {
            ...DEFAULT_STATE
            // snake: [{x:3,y:0,t:CTYPE.SNAKE}, {x:2,y:0,t:CTYPE.SNAKE}, {x:1,y:0,t:CTYPE.SNAKE}, {x:0,y:0,t:CTYPE.SNAKE}],
            // others: [{x:2,y:7,t:CTYPE.FOOD_PLUS},{x:5,y:7,t:CTYPE.FOOD_PLUS},{x:7,y:3,t:CTYPE.FOOD_MINUS}],
            // direction: DIRECTION.RIGHT,
            // started: false,
            // status: STATUS.RUNNING,
            // foodCount: FOOD_COUNT,
            // lastFood: '',
            // score: 0,
        };
    }

    componentDidMount() {
        // this.resumeGame();
        
        window.addEventListener('keydown', this.keydown.bind(this));
    }
    
    getSquare(square){
        let data = this.state.snake.find(a => a.x === square.x && a.y === square.y);
        if(!data){
            data = this.state.others.find(a => a.x === square.x && a.y === square.y);
        }
        if(!data){
            data = {'x':square.x,'y':square.y,'t':CTYPE.BLANK};
        }
        return data;
    }

    componentWillUnmount(){
        this.stopGame();
    }

    keydown = (event) => {
        // console.log(event.key);
        
        if(this.state.status === STATUS.FUCKED) {return;}
        let dir = '';
        switch (event.key) {
            case 'ArrowUp': if(this.state.direction ===DIRECTION.LEFT || this.state.direction ===DIRECTION.RIGHT) {dir = DIRECTION.UP;} break;
            case 'ArrowDown': if(this.state.direction ===DIRECTION.LEFT || this.state.direction ===DIRECTION.RIGHT) {dir = DIRECTION.DOWN;} break;
            case 'ArrowLeft': if(this.state.direction ===DIRECTION.UP || this.state.direction ===DIRECTION.DOWN) {dir = DIRECTION.LEFT;} break;
            case 'ArrowRight': if(this.state.direction ===DIRECTION.UP || this.state.direction ===DIRECTION.DOWN) {dir = DIRECTION.RIGHT;} break;
            case 'Escape': this.swich(); return;
            case 'Enter': this.swich(); return;
            default:
                break;
        }
        if(dir && this.state.directionPool.length < 2){
            if(!(((dir ===DIRECTION.LEFT || dir ===DIRECTION.RIGHT)
            && (this.state.directionPool[0] ===DIRECTION.LEFT || this.state.directionPool[0] ===DIRECTION.RIGHT))
            || ((dir ===DIRECTION.UP || dir ===DIRECTION.DOWN)
            && (this.state.directionPool[0] ===DIRECTION.UP || this.state.directionPool[0] ===DIRECTION.DOWN)))){
                this.setState(() => {
                    return { directionPool: [...this.state.directionPool, dir] }
                })
            }
        }
    };

    
    //add food randomly, TODO: if there's few BLANK, it'll take more time, may be need to change logic 
    createFood() {
        let foods = this.state.others.filter(s => FOOD_LIST.includes(s.t));
        // console.log(`createFood foods.length: ${foods.length}, this.state.others: ${JSON.stringify(this.state.others)}`);
        if(foods.length < this.state.foodCount){
            let data;
            while (!data || data.t !== CTYPE.BLANK) {
                data = this.getSquare({'x':Math.floor(Math.random() * COLUMN_COUNT), 'y':Math.floor(Math.random() * COLUMN_COUNT)});
            }
            data.t = this.getFoodType();
            this.setState( () => {
                // let data = this.state.others.filter( a => !(a.x === newItem.x && a.y === newItem.y)).slice();
                // console.log(JSON.stringify(data));
                return {
                    others: Array.of(data, ...this.state.others.slice())
                }
            })
        }
    }
    
    getFoodType(){
        let foodList;
        if (this.state.foodCount <= 5) {
            foodList = FOOD_LIST1;
        } else if (this.state.foodCount > 5 && this.state.foodCount < 12){
            foodList = FOOD_LIST2;
        } else {
            foodList = FOOD_LIST3;
        }

        return foodList[Math.floor(Math.random() * foodList.length)];
    }

    // checkFood = (p) => FOOD_LIST.includes(p) ;

    swich(){
        console.log(`this.state.status: ${this.state.status}, this.state.started: ${this.state.started}`);
        if(this.state.status === STATUS.RUNNING){
            if(this.state.started){
                this.stopGame();
            } else {
                this.resumeGame();
            }
        }
    }
    resetSpeed(){
        clearInterval(this.moveTimer);
        this.moveTimer = setInterval(() => this.move(), this.state.speed);
    }

    resumeGame(){
        if(!this.state.started && this.state.status === STATUS.RUNNING){
            this.moveTimer = setInterval(() => this.move(), this.state.speed);
            this.foodTimer = setInterval(() => this.createFood(), 1000);
            this.setState({
                started: true
            });
        }
    }

    stopGame() {
        console.log(`stopGame: ${this.state.started} - ${this.state.status} - ${this.moveTimer}`);
        if(this.state.started && this.state.status === STATUS.RUNNING){
            clearInterval(this.moveTimer);
            clearInterval(this.foodTimer);
            this.setState({
                started: false
            });
        }
    }
    

    move = () => {
        let newItem =  {};
        let directionPool = this.state.directionPool;
        let direction = this.state.direction;
        if(directionPool && directionPool.length > 0){
            direction = this.state.directionPool[0];
            directionPool = directionPool.slice(1);
        }
        Object.assign(newItem, this.state.snake[0]);
        // console.log(`${Math.floor(Math.random() * COLUMN_COUNT)}`);
        switch (direction) {
            case DIRECTION.UP:
                newItem.y = newItem.y === 0?COLUMN_COUNT - 1:newItem.y - 1;
                break;
            case DIRECTION.DOWN:
                newItem.y = newItem.y === COLUMN_COUNT - 1?0:newItem.y + 1;
                break;
            case DIRECTION.LEFT:
                newItem.x = newItem.x === 0?COLUMN_COUNT - 1:newItem.x - 1;
                break;
            case DIRECTION.RIGHT:
                newItem.x = newItem.x === COLUMN_COUNT - 1?0:newItem.x + 1;
                break;
            default:
                break;
        }
        this.history = this.history?[this.history[1], {...this.state}]:[{...this.state}];
        let target = this.getSquare(newItem);
        // console.log(`move2 ${this.state.direction} - ${JSON.stringify(newItem)} - ${target.t}`);
        if(target) {
            switch (target.t) {
                case CTYPE.BLANK:
                    this.moveOne(newItem, direction, directionPool);
                    // this.setState( () => {
                    //     return {
                    //         snake: Array.of(newItem, ...this.state.snake.slice(0, this.state.snake.length - 1)),
                    //         direction: direction,
                    //         directionPool: directionPool
                    //     }
                    // })
                    // this.setState({
                    //     snake: Array.of(newItem, ...this.state.snake.slice(0, this.state.snake.length - 1))
                    // })
                    break;
                case CTYPE.WALL:
                case CTYPE.SNAKE:
                    if(this.state.snake[this.state.snake.length - 1].x === newItem.x 
                    && this.state.snake[this.state.snake.length - 1].y === newItem.y ){
                        this.moveOne(newItem, direction, directionPool);
                    } else {
                        this.fucked(direction, directionPool);
                    }
                    break;
                case CTYPE.FOOD_PLUS:
                case CTYPE.FOOD_MINUS:
                case CTYPE.FOOD_ERASER:
                case CTYPE.FOOD_S_DOWN:
                case CTYPE.FOOD_S_UP:
                    this.mixi(target.t, newItem, direction, directionPool);
                    break;
                
                default:
                    break;
            }
        }
    }

    moveOne(newItem, direction, directionPool){
        this.setState( () => {
            return {
                snake: Array.of(newItem, ...this.state.snake.slice(0, this.state.snake.length - 1)),
                direction: direction,
                directionPool: directionPool
            }
        })
    }

    mixi(type, newItem, direction, directionPool){

        let others;
        let snake;
        let foodCount = this.state.foodCount;
        let lastFood = type;
        let others2 = [...this.state.others.slice()];
        let score = 100 + 10 * this.state.foodCount;
        let speed = this.state.speed;

        if(this.state.lastFood === type){
            switch (type) {
                case CTYPE.FOOD_PLUS:
                    foodCount = foodCount+2>FOOD_MAX_COUNT?FOOD_MAX_COUNT:foodCount+2;
                    break;
            
                case CTYPE.FOOD_MINUS:
                    foodCount = foodCount-2<FOOD_MIN_COUNT?FOOD_MIN_COUNT:foodCount-2;
                    break;
                
                case CTYPE.FOOD_ERASER:
                    others2 = this.erase(newItem);
                    break;
                
                case CTYPE.FOOD_S_DOWN:
                    speed += speed<100?20:speed<350?50:0;
                    break;

                case CTYPE.FOOD_S_UP:
                    speed -= speed>100?50:(speed>50?10:0);
                    break;

                default:
                    break;
            }
            lastFood = '';
            score *= 2;
        }

        if(this.state.snake.length + 1 >= SNAKE_MAX_LENGTH){
            others = [...this.state.snake.slice(SNAKE_MIN_LENGTH - 1 )];
            others.forEach(d => {d.t = CTYPE.WALL});
            others = [...others, ...others2.filter( a => !(a.x === newItem.x && a.y === newItem.y)).slice()];
            snake = Array.of(newItem, ...this.state.snake.slice(0, SNAKE_MIN_LENGTH - 1 ));
        } else {
            others = [...others2.filter( a => !(a.x === newItem.x && a.y === newItem.y)).slice()];
            snake = Array.of(newItem, ...this.state.snake.slice());
        }
        this.setState({
                others: others,
                snake: snake,
                lastFood: lastFood,
                foodCount: foodCount,
                score: this.state.score + score,
                speed: speed,
                direction: direction,
                directionPool: directionPool
        }, this.resetSpeed)
    }
    //5 * 7라고 하면 ...
    erase(newItem){
        let x1, x2, y1, y2;
        switch (this.state.direction) {
            case DIRECTION.UP:
                x1 = newItem.x - 2;
                x2 = newItem.x + 2;
                y1 = newItem.y - 7;
                y2 = newItem.y - 1;
                break;
            case DIRECTION.DOWN:
                x1 = newItem.x - 2;
                x2 = newItem.x + 2;
                y1 = newItem.y + 1;
                y2 = newItem.y + 7;
                break;
            case DIRECTION.LEFT:
                x1 = newItem.x - 7;
                x2 = newItem.x - 1;
                y1 = newItem.y - 2;
                y2 = newItem.y + 2;
                break;
            case DIRECTION.RIGHT:
                x1 = newItem.x + 1;
                x2 = newItem.x + 7;
                y1 = newItem.y - 2;
                y2 = newItem.y + 2;
                break;
            default:
                break;
        }
        const flash = {x1, x2, y1, y2};
        this.flashCount = 0;
        this.flashtimer = setInterval(() => {
            console.log(`flashtimer: ${JSON.stringify(flash)}`)
            if(this.flashCount > 3){
                this.flashCount = 0;
                clearInterval(this.flashtimer);
            } else {
                if (this.flashCount % 2 === 0) {
                    this.setState({
                        flash:flash
                    })
                } else {
                    this.setState({
                        flash:{}
                    })
                }
                this.flashCount++;
            }
        }, 10);
        return this.state.others.filter( a => !(a.x >= x1 && a.x <= x2 && a.y >= y1 && a.y <= y2 && a.t === CTYPE.WALL)).slice();
        // return {'others':others, 'flash':flash};
    }



    fucked(direction, directionPool){
        // let data = [...this.state.snake.map(s => {return {'x':s.x,'y':s.y,t:CTYPE.FUCKED_SNAKE}}).slice()];
        // console.log(JSON.stringify(data));
        clearInterval(this.moveTimer);
        clearInterval(this.foodTimer);
        this.setState({
            snake: [...this.state.snake.map(s => {return {'x':s.x,'y':s.y,t:CTYPE.FUCKED_SNAKE}}).slice()],
            started: false,
            status: STATUS.FUCKED,
            direction: direction,
            directionPool: directionPool
        });
    }
    reset(){
        this.setState({...DEFAULT_STATE})
    }

    resetToHistory(){
        if(this.history){
            this.setState({...this.history[0]});
        }
        console.log(JSON.stringify(this.history));
    }

    render() {
        // console.log(`foodHistory: ${JSON.stringify(this.state.foodHistory)}`)
        // const history = this.state.history;
        // const moves = history.map((step, move) => {
        //     const msg = 'Go to move #' + move + '(' + Math.floor(step.index / 3) + '/' + step.index % 3 + ')';
        //     const desc = move ?
        //         (move === this.state.stepNumber ? <b>{msg}</b>: msg):
        //         'Go to game start';
        //     return (
        //         <li key={move}>
        //             {desc}
        //         </li>
        //     );
        // });

        // let status = 'xxx';
        return (
            <div className="game">
                {/* <div>{JSON.stringify( this.state.snake.length)} - {this.state.status}</div>  */}
                {/* <button onClick={this.start}>start</button>
                <button onClick={this.end}>end</button> */}
                <div className="game-board">
                    <Board
                        others={this.state.others}
                        snake={this.state.snake}
                        flash={this.state.flash}
                    />
                </div>
                <div className="game-info">
                        <Square key={-1} type={this.state.lastFood} /> 
                    <div className='game-info2'>
                     SNAKE LENGTH: <span className='label-highlight'>{this.state.snake.length}</span>, 
                     FOOD COUNT:  <span className='label-highlight'>{this.state.foodCount}</span>,
                     SPEED:  <span className='label-highlight'>{this.state.speed}</span>,
                     SCORE: <span className='label-highlight'>{this.state.score}</span>
                     {/* dirPool: <span className='label-highlight'>{JSON.stringify(this.state.directionPool)}</span> */}
                    <button className='game-info2' onClick={this.resumeGame.bind(this)} > start </button> 
                    <button className='game-info2' onClick={this.reset.bind(this)} > reset </button>
                    <button className='game-info2' onClick={this.resetToHistory.bind(this)} > history </button>
                     </div>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
