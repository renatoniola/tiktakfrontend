import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import  makeMove  from '../actions/moves/moves'
import { fetchOneGame, fetchPlayers } from '../actions/games/fetch'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import JoinGameDialog from '../components/games/JoinGameDialog'

import './game.css'

const playerShape = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  pairs: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string
})

class Game extends PureComponent {
  static propTypes = {
    fetchOneGame: PropTypes.func.isRequired,
    fetchPlayers: PropTypes.func.isRequired,
    subscribeToWebsocket: PropTypes.func.isRequired,
    game: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      players: PropTypes.arrayOf(playerShape),
      draw: PropTypes.bool,
      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      started: PropTypes.bool,
      turn: PropTypes.number.isRequired,
      cards: PropTypes.arrayOf(PropTypes.shape({
        symbol: PropTypes.string,
        _id: PropTypes.string,
        won: PropTypes.bool,
        visible: PropTypes.bool
      }))
    }),
    currentPlayer: playerShape,
    isPlayer: PropTypes.bool,
    isJoinable: PropTypes.bool,
    hasTurn: PropTypes.bool
  }

  componentWillMount() {
    const { game, fetchOneGame, subscribeToWebsocket } = this.props
    const { gameId } = this.props.match.params

    if (!game) { fetchOneGame(gameId) }
    subscribeToWebsocket()
  }

  componentWillReceiveProps(nextProps) {
    const { game } = nextProps

    if (game && !game.players[0].name) {
      this.props.fetchPlayers(game)
    }
  }

  makeMove(index){
    console.log(this.props.currentPlayer)
    console.log(this.props.game._id)
    console.log('index :' , index)
    this.props.makeMove({ userId : this.props.currentPlayer.userId , location : index , gameId : this.props.game._id})
  }

  render() {
    const { game } = this.props


    if (!game) return null




    console.log( JSON.stringify(this.props, true, 2) )

   let turnMessage = '';
        let grid = game.grid.map( (item,index) => {
          console.log('item : ' ,item)
          if( game.players.length > 1 ) {
           if( item == 0 ){
              return 'x'
           }
           if( item  == 1 ){
              return '0'
           }


           if(  game.players[game.turn].userId !== this.props.currentPlayer.userId ) {
             turnMessage = 'its your turn'
           }
         }
        })



    let renderGrid = grid.map( (item,index) => {
       return <div key={ index} className="grid-cell" onClick={this.makeMove.bind(this,index)}>{ item }</div>
    })
    const title = game.players.map(p => (p.name || null))
      .filter(n => !!n)
      .join(' vs ')

    return (
      <div className="Game">

        <h1>Game!</h1>
        <h1>{ title }</h1>


        <div className="grid">
          { renderGrid }
        </div>
        { turnMessage  }
        <JoinGameDialog gameId={game._id} />
      </div>
    )
  }
}

  const mapStateToProps = ({ currentUser, games }, { match }) => {
  const game = games.filter((g) => (g._id === match.params.gameId))[0]
  const currentPlayer = game && game.players.filter((p) => (p.userId === currentUser._id))[0]
  const hasTurn = !!currentPlayer && game.players[game.turn].userId === currentUser._id
  return {
    currentPlayer,
    game,
    isPlayer: !!currentPlayer,
    hasTurn,
    isJoinable: game && !currentPlayer && game.players.length < 2
  }
}

export default connect(mapStateToProps, {
  subscribeToWebsocket,
  fetchOneGame,
  fetchPlayers,
  makeMove
})(Game)
