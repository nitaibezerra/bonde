import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { browserHistory } from 'react-router'
import * as graphqlMutations from '~client/graphql/mutations'
import * as pressureHelper from '~client/mobilizations/widgets/utils/pressure-helper'
import * as paths from '~client/paths'
import MobSelectors from '~client/mobrender/redux/selectors'
import * as PressureActions from '../action-creators'
import { WidgetOverlay, FinishMessageCustom } from '~client/mobilizations/widgets/components'

// Current module dependencies
import {
  PressureCount,
  PressureForm,
  TargetList,
  PressureTellAFriend
} from '../components'

/* TODO: Change static content by props
 * - title
 * - bgColor
 */
export class Pressure extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      filled: false,
      selectedTargets: [],
      selectedTargetsError: undefined
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ filled: this.props.saving && !nextProps.saving })
  }

  getTargetList () {
    const { targets } = this.props.widget.settings || { targets: '' }
    return targets && targets.split(';').filter(target => !!target.trim())
  }

  getEmailTarget (target) {
    const targetSplit = target.split('<')
    return targetSplit[1].replace('>', '')
  }

  changeSelectedTargets (selectedTargets) {
    this.setState({ selectedTargets })
  }

  handleSubmit (data) {
    if (data.pressureType === pressureHelper.PRESSURE_TYPE_EMAIL) {
      const { widget, asyncFillWidget } = this.props
      const payload = {
        activist: {
          firstname: data.name,
          lastname: data.lastname,
          email: data.email,
          city: data.city || null
        },
        mail: {
          cc: this.getTargetList().map(target => this.getEmailTarget(target)),
          subject: data.subject,
          body: data.body
        }
      }
      asyncFillWidget({ payload, widget })
    } else if (data.pressureType === pressureHelper.PRESSURE_TYPE_PHONE) {
      if (!this.state.selectedTargets.length) {
        this.setState({
          selectedTargetsError:
            'Ops, você precisa selecionar pelo menos um alvo para poder pressionar'
        })
      } else {
        this.setState({ selectedTargetsError: undefined })
        // it needs to find or create the activist data
        this.props.createTwilioCall({
          from: data.phone,
          to: this.state.selectedTargets.map(target => target.value).join(',')
        })
      }
    }
  }

  handleOverlayOnClick (e) {
    const { mobilization, widget, editable } = this.props
    if (editable) {
      if (e) e.preventDefault()
      browserHistory.push(
        paths.pressure(mobilization.id, widget.id)
      )
    }
  }

  render () {
    const {
      block,
      widget,
      editable,
      saving,
      filledPressureWidgets,
      mobilization
    } = this.props
    const { header_font: headerFont } = mobilization
    const {
      main_color: mainColor,
      title_text: titleText,
      button_text: buttonText,
      // Maybe `reply_email` is necessary...
      // reply_email,
      show_counter: showCounter,
      count_text: countText,
      pressure_subject: pressureSubject,
      pressure_body: pressureBody,
      finish_message_type: finishMessageType,
      disable_edit_field: disableEditField
    } = widget.settings || {
      main_color: '#f23392',
      title_text: 'Envie um e-mail para quem pode tomar essa decisão',
      button_text: 'Enviar e-mail',
      disable_edit_field: 'n'
    }

    return (
      <WidgetOverlay
        editable={editable}
        onClick={::this.handleOverlayOnClick}
        text='Clique para configurar o formulário de pressão direta'
      >
        {filledPressureWidgets.includes(widget.id) ? (
          finishMessageType === 'custom' ? (
            <FinishMessageCustom widget={widget} />
          ) : (
            <PressureTellAFriend mobilization={mobilization} widget={widget} />
          )
        ) : (
          <div className='pressure-widget'>
            <div onKeyDown={(e) => e.stopPropagation()} />
            <h2
              className='center py2 px3 m0 white rounded-top'
              style={{ backgroundColor: mainColor, fontFamily: headerFont }}
            >
              {titleText}
            </h2>
            <TargetList
              targets={::this.getTargetList() || []}
              onSelect={::this.changeSelectedTargets}
              errorMessage={this.state.selectedTargetsError}
            />
            <PressureForm
              disabled={disableEditField === 's'}
              widget={widget}
              buttonText={(saving && !editable ? 'Enviando...' : buttonText)}
              buttonColor={mainColor}
              subject={pressureSubject}
              body={pressureBody}
              onSubmit={::this.handleSubmit}
              targetList={this.getTargetList()}
              selectedTargets={this.selectedTargets}
            >
              {!showCounter || showCounter !== 'true' ? null : (
                <PressureCount
                  value={widget.count || 0}
                  color={mainColor}
                  text={countText}
                  startCounting={block.scrollTopReached}
                />
              )}
            </PressureForm>
          </div>
        )}
      </WidgetOverlay>
    )
  }
}

Pressure.propTypes = {
  editable: PropTypes.bool,
  mobilization: PropTypes.object.isRequired,
  widget: PropTypes.shape({
    settings: PropTypes.shape({
      finish_message_type: PropTypes.string,
      finish_message: PropTypes.string,
      finish_message_background: PropTypes.string
    }).isRequired
  }).isRequired,
  saving: PropTypes.bool,
  filledPressureWidgets: PropTypes.array,
  // Actions
  asyncFillWidget: PropTypes.func
}

const mapStateToProps = (state, props) => {
  const pressure = MobSelectors(state, props).getPlugin('pressure')
  const { saving, filledPressureWidgets } = pressure
  return { saving, filledPressureWidgets }
}

const mapDispatchToProps = (dispatch, props) => ({
  ...props,
  ...PressureActions,
  createTwilioCall: variables => props.mutate({ variables })
})

export default graphql(graphqlMutations.createTwilioCall)(
  connect(mapStateToProps, mapDispatchToProps)(Pressure)
)
