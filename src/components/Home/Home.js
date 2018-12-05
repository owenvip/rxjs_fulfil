import React, { Component } from 'react'
import { fromEvent, from } from 'rxjs'
import { map, filter, tap, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Input, Row, Col, List, Icon, Tag } from 'antd'
import { request } from '../../utils/axios'

const SEARCH_REPOS = 'https://api.github.com/search/repositories?sort=stars&order=desc&q='

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
)

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResult: [],
    }
  }

  componentDidMount() {
    const InputOberver = fromEvent(document.getElementById('searchInput'), 'keyup').pipe(
      debounceTime(1000),
      map(ev => ev.target.value.trim()),
      filter(val => !!val),
      distinctUntilChanged(),
      switchMap(val =>
        this.getPromise({
          url: SEARCH_REPOS + val,
          method: 'get',
        }),
      ),
      tap(result => {
        const { items } = result.data
        const searchResult =
          items.length > 0
            ? items.map(list => ({
              href: list.html_url,
              title: list.full_name,
              description: list.description,
                star: list.stargazers_count,
              language: list.language,
            }))
            : []
        searchResult.length > 0 && (this.setState({ searchResult }))
      })
    )
    InputOberver.subscribe()
  }

  getPromise = param => from(request(param))

  renderItem = item => (
    <List.Item
      key={item.title}
      actions={[
        <IconText type="star-o" text={item.star} />,
        <Tag>{item.language}</Tag>,
      ]}
    >
      <List.Item.Meta title={<a href={item.href}>{item.title}</a>} description={item.description} />
    </List.Item>
  )

  render() {
    return (
      <div>
        <Row>
          <Col span={12} offset={6}>
            <Input id="searchInput" size="large" placeholder="Search in Github" />
          </Col>
        </Row>
        <Row style={{ marginTop: 50 }}>
          <Col span={24}>
            <List
              itemLayout="vertical"
              bordered
              pagination={false}
              dataSource={this.state.searchResult}
              renderItem={this.renderItem}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
