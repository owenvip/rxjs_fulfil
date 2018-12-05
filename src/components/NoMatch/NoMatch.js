import React, { Component } from 'react';
import '../../style/no-math.less';

export default class NoMatch extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div id="noMatch">
        <section>
          <span>404</span>
          <p>The requested path could not be found</p>
        </section>
      </div>
    );
  }
}
