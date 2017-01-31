import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { DropDownMenu, NavbarEditionWrapper } from '../../../../scripts/components'

const MenuItems = ({ blocks, mobile, menuProps }) => {
  const items = blocks.map(block => (
    <div key={block.id} className={classnames({ 'menu-item inline-block': !mobile })}>
      <NavbarEditionWrapper
        key={`navbar-edition-wrapper-${block.id}`}
        block={block}
        className='btn btn-transparent block white p2'
        {...menuProps}
      />
    </div>
  ))

  return !mobile ? (
    <div className='lg-show center'>
      <div className='bg-darken-4'>
        {items}
      </div>
    </div>
  ) : (
    <div className='lg-hide'>
      <DropDownMenu
        wrapperClassName='absolute right-0 top-0 m1'
        buttonClassName='btn bg-darken-4 white rounded'
        menuClassName='rounded bg-darken-4 white top-0 right-0'
        menuStyle={{ marginTop: '40px' }}
        icon='bars'
      >
        {items}
      </DropDownMenu>
    </div>
  )
}

MenuItems.defaultProps = {
  mobile: false
}

MenuItems.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number })
  ).isRequired,
  mobile: PropTypes.bool
}

export default MenuItems
