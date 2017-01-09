import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Global module dependencies
import * as Paths from './../../../../Paths'
import { Loading } from './../../../../components'
import { SettingsPageLayout, SettingsPageContentLayout } from '../../../../../components/Layout'

// Parent module dependencies
import { actions as WidgetActions } from '../../../../../modules/widgets'

// Current module dependencies
import { Menu } from '../components'
import FormWidget from '../../../../../modules/widgets/__plugins__/form/components'

class Fields extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { loading: false, hasNewField: false }
  }

  componentWillReceiveProps(nextProps) {
    const { widget } = this.props
    if (this.state.loading && widget != this.widget(nextProps)) {
      this.setState({ loading: false, hasNewField: true })
    } else {
      this.setState({ hasNewField: false })
    }
  }

  handleAddTextField() {
    this.addField('text')
  }

  widget(props = this.props) {
    const { widgets } = props
    return widgets.data[widgets.data.map((widget) => { return widget.id.toString()}).indexOf(this.props.params.widget_id)]
  }

  fields() {
    const { widget: { settings } } = this.props
    return (settings && settings.fields ? settings.fields : [])
  }

  addField(kind) {
    const { widget, asyncWidgetUpdate } = this.props
    const { settings } = widget
    const fields = this.fields()

    this.setState({ loading: true })
    asyncWidgetUpdate({
      ...widget,
      settings: {
        ...settings,
        fields: [
          ...fields,
          {
            uid: `field-${Date.now().toString()}-${Math.floor((Math.random() * 100) + 1)}`,
            kind: 'text',
            label: '',
            placeholder: '',
            required: 'false',
          }
        ]
      }
    })
  }

  renderFields() {
    const { widget, ...props } = this.props
    return (
      <SettingsPageLayout>
        <Menu widget={widget} {...props} />
        <button
          className="btn white bg-pagenta caps p2 rounded"
          onClick={::this.handleAddTextField}
          style={{
            position: 'fixed',
            top: '2rem',
            right: '4rem',
            width: 'inherit',
            textTransform: 'uppercase',
            margin: '0',
            fontSize: '1.1rem',
            padding: '.7rem 1.6rem'
          }}
        >
          Adicionar um campo
        </button>
        <SettingsPageContentLayout>
          <p className="h5 mb3 darkengray">
            {
              this.fields().length == 0 ?
              'Seu formulário ainda não possui nenhum campo. Clique abaixo para começar a'
                + ' adicionar campos.' :
              'Adicione, remova, edite e ordene os campos do formulário de acordo com as'
                + ' necessidades da sua ação.'
            }
          </p>

          <FormWidget
            {...props}
            widget={widget}
            configurable={true}
            hasNewField={this.state.hasNewField}
          />
          </SettingsPageContentLayout>
        {this.renderLoading()}
      </SettingsPageLayout>
    )
  }

  renderLoading(){
    const { loading } = this.state
    const { widget } = this.props
    return loading || widget === undefined ? <Loading /> : null
  }

  render() {
    const { widget, ...props } = this.props
    return(widget !== undefined ? this.renderFields() : this.renderLoading())
  }
}

Fields.propTypes = {
  mobilization: PropTypes.object.isRequired,
  widget: PropTypes.object.isRequired,
  asyncWidgetUpdate: PropTypes.func.isRequired
}

export default connect(undefined, WidgetActions)(Fields)
