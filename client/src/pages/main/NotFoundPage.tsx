/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet-async'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404!</title>
      </Helmet>
      <div>NotFoundPage</div>
    </>
  )
}

export default NotFoundPage
