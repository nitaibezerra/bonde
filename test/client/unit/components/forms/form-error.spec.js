import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

// Current module dependencies
import { FormError } from '~components/forms'

describe('client/components/forms/form-error', () => {
  let wrapper
  const context = {
    $formRedux: {
      error: 'foo'
    }
  }

  beforeAll(() => {
    wrapper = shallow(<FormError />, { context })
  })

  describe('#render', () => {
    it('should render without crash', () => {
      expect(wrapper).to.be.ok
    })
  })
})