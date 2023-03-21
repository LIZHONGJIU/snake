import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './component/Board';
import Square from './component/Square';
// import {common.FOOD_COUNT, common.SNAKE_MIN_LENGTH, common.FOOD_MAX_COUNT, common.FOOD_MIN_COUNT, common.CTYPE, common.SNAKE_MAX_LENGTH, common.COLUMN_COUNT, common.FOOD_LIST, common.FOOD_LIST1, common.FOOD_LIST2, common.FOOD_LIST3, common.DIRECTION, common.STATUS, common.SPEED, common.DEFAULT_STATE} from './common';
import common from './common';
import './index.css';

class Game extends React.Component {
    constructor(props) {
        console.log(JSON.stringify(common.DEFAULT_STATE));
        console.log(JSON.stringify(common.CTYPE));
        super(props);
        const history = [{},{}];
        this.state = {
            ...common.DEFAULT_STATE
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
            data = {'x':square.x,'y':square.y,'t':common.CTYPE.BLANK};
        }
        return data;
    }

    componentWillUnmount(){
        this.stopGame();
    }

    keydown = (event) => {
        // console.log(event.key);
        
        if(this.state.status === common.STATUS.FUCKED) {return;}
        let dir = '';
        switch (event.key) {
            case 'ArrowUp': if(this.state.direction ===common.DIRECTION.LEFT || this.state.direction ===common.DIRECTION.RIGHT) {dir = common.DIRECTION.UP;} break;
            case 'ArrowDown': if(this.state.direction ===common.DIRECTION.LEFT || this.state.direction ===common.DIRECTION.RIGHT) {dir = common.DIRECTION.DOWN;} break;
            case 'ArrowLeft': if(this.state.direction ===common.DIRECTION.UP || this.state.direction ===common.DIRECTION.DOWN) {dir = common.DIRECTION.LEFT;} break;
            case 'ArrowRight': if(this.state.direction ===common.DIRECTION.UP || this.state.direction ===common.DIRECTION.DOWN) {dir = common.DIRECTION.RIGHT;} break;
            case 'Escape': this.swich(); return;
            case 'Enter': this.swich(); return;
            default:
                break;
        }
        if(dir && this.state.directionPool.length < 2){
            if(!(((dir ===common.DIRECTION.LEFT || dir ===common.DIRECTION.RIGHT)
            && (this.state.directionPool[0] ===common.DIRECTION.LEFT || this.state.directionPool[0] ===common.DIRECTION.RIGHT))
            || ((dir ===common.DIRECTION.UP || dir ===common.DIRECTION.DOWN)
            && (this.state.directionPool[0] ===common.DIRECTION.UP || this.state.directionPool[0] ===common.DIRECTION.DOWN)))){
                this.setState(() => {
                    return { directionPool: [...this.state.directionPool, dir] }
                })
            }
        }
    };

    
    //add food randomly, TODO: if there's few BLANK, it'll take more time, may be need to change logic 
    createFood() {
        let foods = this.state.others.filter(s => common.FOOD_LIST.includes(s.t));
        // console.log(`createFood foods.length: ${foods.length}, this.state.others: ${JSON.stringify(this.state.others)}`);
        if(foods.length < this.state.foodCount){
            let data;
            while (!data || data.t !== common.CTYPE.BLANK) {
                data = this.getSquare({'x':Math.floor(Math.random() * common.COLUMN_COUNT), 'y':Math.floor(Math.random() * common.COLUMN_COUNT)});
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
            foodList = common.FOOD_LIST1;
        } else if (this.state.foodCount > 5 && this.state.foodCount < 12){
            foodList = common.FOOD_LIST2;
        } else {
            foodList = common.FOOD_LIST3;
        }


        //用已有的food量，管理刷新的food概率
        let tmp = {};
        this.state.others.forEach(element => {
            // console.log(`getFoodType: ${JSON.stringify(element)}`);
            tmp[element.t] = (tmp[element.t]?tmp[element.t]:0) + 1;
        });
        let foodList2 = [];
        foodList.forEach(element => {
            let count = this.state.foodCount - (tmp[element]?tmp[element]:0);
            // console.log(`getFoodType1: ${this.state.foodCount} - ${tmp[element]} - ${element} - ${count}`);
            for (let index = 0; index < count; index++) {
                foodList2.push(element);
                
            }
        })

        // console.log(`getFoodTypex: ${JSON.stringify(foodList2)}`);

        return foodList2[Math.floor(Math.random() * foodList2.length)];
        // return foodList[Math.floor(Math.random() * foodList.length)];
    }

    // checkFood = (p) => common.FOOD_LIST.includes(p) ;

    swich(){
        console.log(`this.state.status: ${this.state.status}, this.state.started: ${this.state.started}`);
        if(this.state.status === common.STATUS.RUNNING){
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
        if(!this.state.started && this.state.status === common.STATUS.RUNNING){
            this.moveTimer = setInterval(() => this.move(), this.state.speed);
            this.foodTimer = setInterval(() => this.createFood(), 1000);
            this.setState({
                started: true
            });
        }
    }

    stopGame() {
        console.log(`stopGame: ${this.state.started} - ${this.state.status} - ${this.moveTimer}`);
        if(this.state.started && this.state.status === common.STATUS.RUNNING){
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
        // console.log(`${Math.floor(Math.random() * common.COLUMN_COUNT)}`);
        switch (direction) {
            case common.DIRECTION.UP:
                newItem.y = newItem.y === 0?common.COLUMN_COUNT - 1:newItem.y - 1;
                break;
            case common.DIRECTION.DOWN:
                newItem.y = newItem.y === common.COLUMN_COUNT - 1?0:newItem.y + 1;
                break;
            case common.DIRECTION.LEFT:
                newItem.x = newItem.x === 0?common.COLUMN_COUNT - 1:newItem.x - 1;
                break;
            case common.DIRECTION.RIGHT:
                newItem.x = newItem.x === common.COLUMN_COUNT - 1?0:newItem.x + 1;
                break;
            default:
                break;
        }
        this.history = this.history?[this.history[1], {...this.state}]:[{...this.state}];
        let target = this.getSquare(newItem);
        // console.log(`move2 ${this.state.direction} - ${JSON.stringify(newItem)} - ${target.t}`);
        if(target) {
            switch (target.t) {
                case common.CTYPE.BLANK:
                    this.moveOne(newItem, direction, directionPool);
                    break;
                case common.CTYPE.WALL:
                case common.CTYPE.SNAKE:
                    if(this.state.snake[this.state.snake.length - 1].x === newItem.x 
                    && this.state.snake[this.state.snake.length - 1].y === newItem.y ){
                        this.moveOne(newItem, direction, directionPool);
                    } else {
                        this.fucked(direction, directionPool);
                    }
                    break;
                case common.CTYPE.FOOD_PLUS:
                case common.CTYPE.FOOD_MINUS:
                case common.CTYPE.FOOD_ERASER:
                case common.CTYPE.FOOD_S_DOWN:
                case common.CTYPE.FOOD_S_UP:
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
                case common.CTYPE.FOOD_PLUS:
                    foodCount = foodCount+2>common.FOOD_MAX_COUNT?common.FOOD_MAX_COUNT:foodCount+2;
                    break;
            
                case common.CTYPE.FOOD_MINUS:
                    foodCount = foodCount-2<common.FOOD_MIN_COUNT?common.FOOD_MIN_COUNT:foodCount-2;
                    break;
                
                case common.CTYPE.FOOD_ERASER:
                    others2 = this.erase(newItem);
                    break;
                
                case common.CTYPE.FOOD_S_DOWN:
                    speed += speed<100?20:speed<350?50:0;
                    break;

                case common.CTYPE.FOOD_S_UP:
                    speed -= speed>100?50:(speed>50?10:0);
                    break;

                default:
                    break;
            }
            lastFood = '';
            score *= 2;
        }

        if(this.state.snake.length + 1 >= common.SNAKE_MAX_LENGTH){
            others = [...this.state.snake.slice(common.SNAKE_MIN_LENGTH - 1 )];
            others.forEach(d => {d.t = common.CTYPE.WALL});
            others = [...others, ...others2.filter( a => !(a.x === newItem.x && a.y === newItem.y)).slice()];
            snake = Array.of(newItem, ...this.state.snake.slice(0, common.SNAKE_MIN_LENGTH - 1 ));
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
        let dir = this.state.direction;
        if(this.state.directionPool && this.state.directionPool.length > 0){
            dir = this.state.directionPool[0];
        }
        let x1, x2, y1, y2;
        switch (dir) {
            case common.DIRECTION.UP:
                x1 = newItem.x - 2;
                x2 = newItem.x + 2;
                y1 = newItem.y - 7;
                y2 = newItem.y - 1;
                break;
            case common.DIRECTION.DOWN:
                x1 = newItem.x - 2;
                x2 = newItem.x + 2;
                y1 = newItem.y + 1;
                y2 = newItem.y + 7;
                break;
            case common.DIRECTION.LEFT:
                x1 = newItem.x - 7;
                x2 = newItem.x - 1;
                y1 = newItem.y - 2;
                y2 = newItem.y + 2;
                break;
            case common.DIRECTION.RIGHT:
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
        }, 40);
        return this.state.others.filter( a => !(a.x >= x1 && a.x <= x2 && a.y >= y1 && a.y <= y2 && a.t === common.CTYPE.WALL)).slice();
        // return {'others':others, 'flash':flash};
    }



    fucked(direction, directionPool){
        // let data = [...this.state.snake.map(s => {return {'x':s.x,'y':s.y,t:common.CTYPE.FUCKED_SNAKE}}).slice()];
        // console.log(JSON.stringify(data));
        clearInterval(this.moveTimer);
        clearInterval(this.foodTimer);
        this.setState({
            snake: [...this.state.snake.map(s => {return {'x':s.x,'y':s.y,t:common.CTYPE.FUCKED_SNAKE}}).slice()],
            started: false,
            status: common.STATUS.FUCKED,
            direction: direction,
            directionPool: directionPool
        });
    }
    reset(){
        this.setState({...common.DEFAULT_STATE})
    }

    resetToHistory(){
        if(this.history){
            this.setState({...this.history[0]});
        }
        console.log(JSON.stringify(this.history));
    }

    render() {
        console.log(`${JSON.stringify(this.state)}`);
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
                     common.SPEED:  <span className='label-highlight'>{this.state.speed}</span>,
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
