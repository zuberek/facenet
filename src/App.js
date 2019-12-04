import React, { Component } from 'react'
import './App.css'
import Network from './Network'
class App extends Component {
  render() {
    return (
        <div className='App'>
          <div>
            <h2>FaceNet</h2>
          </div>
          <div id="visualisation">
            <Network/>
          </div>
        </div>
    )
  }
}
export default App