import React from 'react'
import WYSIHTMLToolbar from './../components/WYSIHTMLToolbar.jsx'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import * as WidgetActions from './../actions/WidgetActions'

export default class WidgetContent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editing: false,
      editor: null,
      content: (props.widget.settings ? props.widget.settings.content : 'Clique para editar...'),
      toolbarId: "wysihtml5-toolbar-" + this.props.widget.id
    }
  }

  componentDidMount() {
    const editor = new wysihtml5.Editor(
      React.findDOMNode(this.refs.content), {
        toolbar: this.state.toolbarId,
        parserRules: wysihtml5ParserRules
      }
    ).on("focus", ::this.handleEditorFocus)
    this.setState({editor: editor})
  }

  handleEditorFocus(){
    this.setState({editing: true})
  }

  handleOverlayClick(){
    if(this.hasChanged()){
      if(confirm("Você deseja salvar suas alterações?")){
        this.save()
      } else {
        this.undo()
      }
    } else {
      this.setState({editing: false})
    }
  }

  undo(){
    this.state.editor.setValue(this.state.content)
    this.setState({editing: false})
  }

  save(){
    this.setState({
      content: this.state.editor.getValue(),
      editing: false
    })

    const { dispatch } = this.props
    const bindedWidgetActions = bindActionCreators(WidgetActions, dispatch)
    bindedWidgetActions.editWidget({
      mobilization_id: this.props.mobilization.id,
      widget_id: this.props.widget.id,
      widget: {
        settings: {
          content: this.state.editor.getValue()
        }
      }
    })
  }

  hasChanged(){
    return this.state.content != this.state.editor.getValue()
  }

  render(){
    const { toolbarId, editing } = this.state
    return (
      <div>
        <div className={classnames("full-width", {"display-none": !editing})}>
          <WYSIHTMLToolbar
            elementId={toolbarId}
            className="absolute full-width top-0 left-0 bg-darken-4"
            buttonClassName="button button-transparent white p2"
            style={{zIndex: 9999}}/>
          <div
            className="fixed top-0 right-0 bottom-0 left-0"
            onClick={::this.handleOverlayClick}
            style={{zIndex: 9998}} />
        </div>
        <div style={{zIndex: editing ? 9999 : 0}} className="relative">
          <div
            className="widget"
            dangerouslySetInnerHTML={{__html: this.state.content}}
            ref="content" />
          <div className={classnames("right", "mt1", {"display-none": !editing})}>
            <button
              onClick={::this.undo}
              className="button button-transparent bg-darken-4 white rounded mr1">
              <i className="fa fa-undo mr1" />
              Desfazer
            </button>
            <button
              onClick={::this.save}
              className="button button-transparent bg-darken-4 white rounded">
              <i className="fa fa-cloud-upload mr1" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    )
  }
}
