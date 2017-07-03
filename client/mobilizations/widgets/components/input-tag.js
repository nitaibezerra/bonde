import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import keycode from 'keycode'
import classnames from 'classnames'
import { BlockTag } from '~client/mobilizations/widgets/components'
import * as array from '~client/utils/array'
import * as os from '~client/utils/browser/os'

var styles = require('exenv').canUseDOM ? require('./input-tag.scss') : {}

class InputTag extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: undefined,
      value: ''
    }
  }

  handleKeyPress (e) {
    //
    // watch the keyboard event to dispatch the trigger to add targets
    // Mac      : cmd + enter
    // Windows  : ctrl + enter
    // Linux    : ctrl + enter
    //
    const mac = os.isMac() && keycode(e) === 'enter' && e.nativeEvent.metaKey
    const windows = os.isWindows() && keycode(e) === 'enter' && e.ctrlKey
    const linux = (os.isLinux() || os.isUnix()) && keycode(e) === 'enter' && e.ctrlKey

    if (mac || windows || linux) {
      e.preventDefault()
      const { onInsertTag, validate } = this.props
      const targets = e.target.value.split('\n')
      const errors = validate && validate(targets)

      if (errors && !errors.valid) {
        this.setState({ error: errors.message })
      } else {
        onInsertTag && onInsertTag(targets)
        this.setState({ value: '', error: undefined })
      }
    }
  }

  handleEdit (target) {
    const { onRemoveTag } = this.props
    onRemoveTag && onRemoveTag(target)
    const value = [...array.clean(this.state.value.split('\n')), target].join('\n')
    this.setState({ value, error: undefined })
  }

  render () {
    const { values, label, onRemoveTag, onRemoveAll, helperText } = this.props

    return (
      <div className='input-tag'>
        {helperText}
        <div className='clearfix mxn2'>
          <div className='col col-6 px2'>
            <div className='form-group'>
              {label && (
                <label
                  style={{ cursor: 'pointer' }}
                  className='h5 bold caps'
                  htmlFor='insert-tag-id'
                >
                  {label}
                  {(this.state.error && <span className='red'> - {this.state.error}</span>)}
                </label>
              )}
              <textarea
                ref='insert'
                id='insert-tag-id'
                type='text'
                rows='7'
                placeholder={
                  'Nome do primeiro alvo <primeiro@alvo.com>\n' +
                  'Nome do segundo alvo <segundo@alvo.com>\n' +
                  'Nome do terceiro alvo <terceiro@alvo.com>\n' +
                  'Nome do quarto alvo <quarto@alvo.com>\n' +
                  'Nome do quinto alvo <quinto@alvo.com>\n' +
                  '...'
                }
                className={classnames('input block h3 col-12 mt1 px1', styles.textarea)}
                value={this.state.value}
                onChange={(e) => this.setState({ value: e.target.value })}
                onKeyDown={::this.handleKeyPress}
              />
            </div>
          </div>

          <div className='col col-6 px2'>
            {array.clean(values).length > 0 && (
              <div className='form-group'>
                <label className='h5 bold caps'>
                  <FormattedMessage
                    id='widgets.components--input-tag.tags.label'
                    defaultMessage='Alvos cadastrados ({targetsCount})'
                    values={{ targetsCount: String(array.clean(values).length) }}
                  />
                </label>
                <BlockTag
                  tags={values}
                  onClick={::this.handleEdit}
                  onRemove={onRemoveTag}
                />
                <div className={styles.buttons}>
                  <button
                    type='button'
                    className={styles.buttonDanger}
                    onClick={onRemoveAll}
                    disabled={!array.clean(values).length}
                  >
                    <i className='fa fa-trash mr1' />
                    <FormattedMessage
                      id='widgets.components--input-tag.button.remove-all'
                      defaultMessage='Remover todos'
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

InputTag.propTypes = {
  label: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  validate: PropTypes.func,
  onInsertTag: PropTypes.func.isRequired,
  onRemoveTag: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  helperText: PropTypes.node.isRequired
}

export default InputTag
