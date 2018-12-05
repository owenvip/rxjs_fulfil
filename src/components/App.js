import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Route, Switch } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import routes from '../router/router'
import Loadable from '../utils/loadable'
import '../style/main.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

// 404
const LoadableNoMatch = Loadable({
  loader: () => import(/* webpackChunkName: "route-noMatch" */ './NoMatch/NoMatch'),
});
//
const menus = [
  {
    key: '/',
    title: 'GitHub ',
  },
]

export default class App extends Component {
  componentDidMount() {
    // async function test() {
    //   const result = await request({
    //     url: '/pubapi/global/globalInfo',
    //     method: 'get',
    //   })
    //   return Promise.resolve(result.data)
    // }
    // test().then(data => console.log(data)).catch(err => console.log(err))
  }

  static get propTypes() {
    return {
      history: PropTypes.object,
    };
  }

  changeUrl = path => () => {
    this.props.history.push(path)
  }

  renderRoute = ({ path, component }) => (
    <Route key={path} path={path} component={component} exact />
  )

  renderMemus = ({ key, title }) => (
    <Menu.Item key={key} onClick={this.changeUrl(key)}>{title}</Menu.Item>
  )

  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            style={{ lineHeight: '64px' }}
          >
            {menus.map(this.renderMemus)}
          </Menu>
        </Header>
        <Layout>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>github search in rxjs</Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <Switch>
                {routes.map(this.renderRoute)}
                <Route component={LoadableNoMatch} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
