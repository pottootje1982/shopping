import React from "react"
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';


export default class Timer extends React.Component {
    constructor(props) {
      super(props);
      this.state = { seconds: 0 };
    }

    tick() {
      this.setState(state => (Object.assign(state, {seconds: state.seconds + 1})));
    }
  
    async componentDidMount() {
      this.interval = setInterval(() => this.tick(), 1000);
      console.log("resp.result")

      var resp = await axios.get("recipes2")
      // .then(resp=>{
      //   console.log(resp);
      //   this.setState(state => Object.assign(state, {recipes: resp.result}))
      // });
      this.setState(state => Object.assign(state, {recipes: resp.data}))
      console.log(this.state);
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    render() {
      return (
        <div>
            <div>
                Seconds: {this.state.seconds}
            </div>
            {this.state.recipes === undefined ? 
              <div>Loading</div>
            :
              <div>
                  {this.state.recipes.map((item, index) => (
                      <div key={index}>{item.name}</div>
                  ))}
              </div>
            }
        </div>
      );
    }
  }
  