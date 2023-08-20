import { Route, Routes } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import { routes } from './routes'

const AppRouter = () => (
  <Routes>
    {routes.map((route) =>
      route.private ? (
        <Route key={route.path} element={<PrivateRoute />}>
          <Route element={route.element} path={route.path} />
        </Route>
      ) : (
        <Route key={route.path} element={route.element} path={route.path} />
      )
    )}
  </Routes>
)

export default AppRouter
