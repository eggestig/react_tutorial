import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
	return (
		<button 
			className="square" 
			onClick={ props.onClick }
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
  renderSquare(i) {
    return (
			<Square 
				value={this.props.squares[i]}
				onClick={() => {this.props.onClick(i)}}
			/>
		);
  }
	
	displayBoard(i) {
		let items = [];
		for(let j = 0; j < i; j++) {
			let innerItems = [];
			for(let k = 0; k < i; k++) {
				innerItems.push(<span key={(j * 3) + k}>{this.renderSquare((j * 3) + k)}</span>);
			}
			items.push(<div className="board-row" key={j}>{ innerItems }</div>);
		}
		
		return items;
	}

  render() {
    return (<div>{ this.displayBoard(3) }</div>);
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(calculateWinner(squares) || squares[i])
			return;
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				move: this.setLocation(i),
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	setLocation(i) {
		let iTemp = i;
		let col = 0;
		let row = 0;
		while(iTemp - 3 >= 0) {
			iTemp -= 3;
			row++;
		}
		col = iTemp;
		return {col: col, row: row};
	}

	displayDesc(move, desc) {
		return (this.state.stepNumber == move ? <b>{desc}</b> : desc);
	}

  render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map( (step, move) => {
			const desc = move ?
				'Go to move #' + move + (' (' + history[move].move.col + ',' + history[move].move.row + ')'):
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>
						{this.displayDesc(move, desc)}
					</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

    return (
      <div className="game">
        <div className="game-board">
          <Board 
						squares={ current.squares }
						onClick={ (i) => {this.handleClick(i)} }
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

