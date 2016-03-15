import React, { Component } from 'react';
import _ from 'lodash';
import {Motion, spring} from 'react-motion';

import RelativeStaff from './RelativeStaff'
import ThoughtAnimation from './ThoughtAnimation'

export default class App extends Component {

  render() {
    return (
      <div>
        {
          /*<ThoughtAnimation/>*/
        }

        {
          <RelativeStaff/>
        }
      </div>

    );
  }
}
