import React from 'react'
import PropTypes from 'prop-types'
/*import classnames from 'classnames'*/

const MenuItem = props => {
  const { children, anchor, hidden } = props
  
  return (
    <a href={`#${anchor}`} className='btn btn-transparent block white p2 navbar-button relative'>
      <span style={{ opacity: hidden ? '.25' : '1' }}>
        {children}
      </span>
      {hidden && (
        <div className='h2 absolute top-0 bottom-0 left-0 right-0 center flex flex-center'>
          <i className='fa fa-eye-slash flex-auto' />
        </div>
      )}
    </a>
  )
}

MenuItem.propTypes = {
  anchor: PropTypes.string,
  hidden: PropTypes.bool
}

export default MenuItem