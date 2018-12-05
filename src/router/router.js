import Loadable from '../utils/loadable'

const routes = [
  {
    path: '/',
    exact: true,
    component: Loadable({
      loader: () => import(/* webpackChunkName: "route-home" */ '../components/Home/Home'),
    }),
  }
]

export default routes
