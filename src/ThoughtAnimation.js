import React, { Component } from 'react';
import _ from 'lodash';
import {Motion, spring} from 'react-motion';

const Triangle = props => {
  const dTheta = (Math.PI * 2) / 3;
  const coords = _(_.range(3))
    .map(x => x * dTheta)
    .map(theta => `${props.x + props.radius * Math.cos(theta)},${props.y + props.radius * Math.sin(theta)}`)
    .value();

  return (<polygon {...props} points={coords.join(' ')}>{props.children}</polygon>)
};

export default class ThoughtAnimation extends Component {
  constructor() {
    super();

    const clamp = (n, min, max) => Math.min(max, Math.max(n, min));
    const getRandomPos = (n) => clamp(_.random(n - 50, n + 50), 100, 300);

    this.state = {
      thoughts: _.map(_.range(10), (x, i) => {
        return {
          id: i,
          type: _.random(2),
          size: _.random(20, 40, true),
          x: getRandomPos(200),
          y: getRandomPos(200),
          rot: _.random(360),
        }
      })
    };

    this.generateNewPositions = () => this.setState({
      thoughts: _.map(this.state.thoughts, th => _.merge({}, th, {
        x: getRandomPos(th.x),
        y: getRandomPos(th.y),
        rot: _.random(360),
      }))
    });

    setInterval(this.generateNewPositions, 300);
  }

  render() {
    const shapes = _.map(this.state.thoughts, (th, i) => {

      const shape = (x, y, rot) => {
        const transform = `rotate(${rot} ${x} ${y})`;

        return {
          0: <Triangle x={x} y={y} radius={th.size} transform={transform} fill="#f00" fillOpacity={1} style={{mixBlendMode: 'screen'}}/>,
          1: <circle cx={x} cy={y} r={th.size / 2} transform={transform} fill="#0f0" fillOpacity={1} style={{mixBlendMode: 'screen'}}/>,
          2: <rect x={x - th.size / 2} y={y - th.size / 2}
                   width={th.size} height={th.size}
                   transform={transform}
                   fill="#00f"
                   fillOpacity={1}
                   style={{mixBlendMode: 'screen'}}
          />
        }[th.type];
      };

      const sq = x => x * x;
      const dist = (x1, y1, x2, y2) => sq(x1 - x2) + sq(y1 - y2);

      const springConf = {stiffness: 40, damping: 3};


      const connections = _(this.state.thoughts)
        .filter(thought => thought.id !== th.id)
        .sortBy(thought => dist(thought.x, thought.y, th.x, th.y))
        .take(2)
        .map(th2 => (
          <Motion key={th.id + '-' + th2.id} style={{x1: spring(th.x, springConf), y1: spring(th.y, springConf), x2: spring(th2.x, springConf), y2: spring(th2.y, springConf)}}>
            {(val) => <line x1={val.x1} y1={val.y1} x2={val.x2} y2={val.y2} stroke="grey" strokeOpacity={0.5} style={{mixBlendMode: 'screen'}} strokeWidth={4}/>}
          </Motion>
        ))
        .value();



      return connections.concat(
        <Motion style={{rot: spring(th.rot, springConf), x: spring(th.x, springConf), y: spring(th.y, springConf)}} key={i}>
          {(val) => shape(val.x, val.y, val.rot)}
        </Motion>
      );
    });

    return (
      <svg width={600} height={600} style={{background: '#666'}} onClick={this.generateNewPositions}>
        {shapes}
      </svg>
    );
  }
}
