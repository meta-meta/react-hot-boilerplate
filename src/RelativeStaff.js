import React, { Component } from 'react';
import _ from 'lodash';
import {Motion, spring} from 'react-motion';

import {hsvToHex} from './colorConversion';

const {abs} = Math;

const Triangle = props => {
  const dTheta = (Math.PI * 2) / 3;
  const coords = _(_.range(3))
    .map(x => x * dTheta)
    .map(theta => `${props.x + props.radius * Math.cos(theta)},${props.y + props.radius * Math.sin(theta)}`)
    .value();

  return (<polygon {...props} points={coords.join(' ')}>{props.children}</polygon>)
};

export default class RelativeStaff extends Component {
  constructor() {
    super();

    this.state = {
      centerNote: 60,
      sequence: [60, 62, 64, 65, 67, 69, 71, 72],
      meter: 4,
    };

    window.addEventListener('resize', this.forceUpdate.bind(this));
  }

  render() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    const midH = height / 2;

    const hGap = width / 30;
    const vGap = height / 26;

    const centerW = height / 50;
    const landmarkW = height / 80;
    const subLandmarkW = height / 150;
    const baseW = height / 300;

    const nToY = n => midH - n * vGap;
    const tToX = t => t * hGap;

    // https://en.wikipedia.org/wiki/Interval_(music)#Size_of_intervals_used_in_different_tuning_systems
    const intervalRatios = {
      0:  [ 1,  1],
      1:  [16, 15],
      2:  [ 9,  8],
      3:  [ 6,  5],
      4:  [ 5,  4],
      5:  [ 4,  3],
      6:  [45, 32],
      7:  [ 3,  2],
      8:  [ 8,  5],
      9:  [ 5,  3],
      10: [16,  9],
      11: [15,  8],
      12: [ 2,  1],
    };

    const strokeDasharray = n => _.times(intervalRatios[n][0], () => '3 3')
      .join(' ')
      .concat(' ')
      .concat(_.times(intervalRatios[n][1], () => '6 3').join(' '));

    const {meter} = this.state;
    const grid = _.map(_.range(width / hGap), t => (
      <line x1={tToX(t)} y1={0}
            x2={tToX(t)} y2={height}
            stroke={hsvToHex(0, 0, 0.8)}
            strokeOpacity={0.5}
            strokeDasharray=""
            strokeWidth={t % meter == 0 ? 6 : 3}
      />
    ));

    const staff = _.map(_.range(-12, 13), n => (
      <line x1={0} y1={nToY(n)}
            x2={width} y2={nToY(n)}
            stroke={hsvToHex(abs(n) / 12, 1, 1)}
            strokeOpacity={0.9}
            strokeDasharray={strokeDasharray(abs(n))}
            style={{mixBlendMode: 'screen'}}
            strokeWidth={_.includes([0, 12], abs(n)) ? centerW
              : (_.includes([5, 7, 10, 11], abs(n))) ? landmarkW
              : (_.includes([3, 4, 8, 9], abs(n))) ? subLandmarkW
              : baseW
              }
      />
    ));

    /* Notes */
    const {sequence, centerNote} = this.state;
    const notes = _.map(sequence, (n, i) => (
      <circle cx={meter * hGap + i * hGap} cy={nToY(n - centerNote)} r={vGap / 3}
              fill="#fff"
              fillOpacity={1}
              style={{mixBlendMode: 'screen'}}
      />
    ));

    return (
      <svg width={width} height={height} style={{background: '#000'}}>
        {grid}
        {staff}
        {notes}
      </svg>
    );
  }
}
