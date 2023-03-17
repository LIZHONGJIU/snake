import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
function Square(props) {
    const highlight = props.highlight?{backgroundColor:'yellow'}:{};
    return (
        <button className="square" onClick={props.onClick} style={highlight}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        // console.log('renderSquare:' + this.props.winner?.find(a => a === i));
        return (
            <Square
                value={this.props.squares[i]}
                highlight={this.props.winner?.find(a => a === i) !== undefined}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
      
        let count = Array.from(Array(this.props.columnCount), (_,x) => x);

        return (
            <div>
                {
                  count.map((_, idx) => {
                    return (
                    <div className="board-row">
                      {count.map((_, idx2) => this.renderSquare(idx * 3 + idx2))}
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
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    index: -1
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            currentIndex: 0
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    index: i
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const columnCount = 3;

        const moves = history.map((step, move) => {
            const msg = 'Go to move #' + move + '(' + Math.floor(step.index / 3) + '/' + step.index % 3 + ')';
            const desc = move ?
                (move === this.state.stepNumber ? <b>{msg}</b>: msg):
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner.winner;
        } else {
          if(this.state.stepNumber === columnCount * columnCount){
            status = "PINGLE XIAO PENG YOU";
          } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
          }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        columnCount={columnCount}
                        winner={winner?.line}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          console.log(JSON.stringify({"winner":squares[a], ...lines[i]}));
            return {"winner":squares[a], "line":lines[i]};
        }
    }
    return null;
}
