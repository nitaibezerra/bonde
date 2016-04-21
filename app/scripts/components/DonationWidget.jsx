import React, { PropTypes } from 'react'
import classnames from 'classnames'
import reactMixin from 'react-mixin'
import { Navigation } from 'react-router'
import { bindActionCreators } from 'redux'
import * as Paths from './../Paths'

@reactMixin.decorate(Navigation)

export default class DonationWidget extends React.Component {
  static propTypes = {
    mobilization: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    configurable: PropTypes.bool,
    hasNewField: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      hasMouseOver: false,
      loading: false,
      success: false,
      selected_value: 1,
      errors: []
    }
  }

  componentWillReceiveProps() {
    if (this.state.loading) {
      this.setState({loading: false, success: true})
    }
  }

  handleMouseEnter() {
    this.setState({hasMouseOver: true})
  }

  handleMouseLeave() {
    this.setState({hasMouseOver: false})
  }

  handleClick() {

    const { mobilization, widget, editable } = this.props
    if (editable) {
      this.transitionTo(Paths.donationMobilizationWidget(mobilization.id, widget.id))
    }
  }

  handleClickSetValueDonation(v) {
    this.setState({selected_value: v})
  }

  handleClickDonate() {
    const { mobilization, widget } = this.props;
    const { success, selected_value } = this.state;

    // INICIAR A INSTÂNCIA DO CHECKOUT
    // declarando um callback de sucesso
    var checkout = new PagarMeCheckout.Checkout({"encryption_key":"ek_test_PYsS1XrZsCCF7wynC67YEi5RW3lSCV", success: (data) => {
     this.setState({'success': true});
   }, error: function (err) {
     console.log(err);
   }});
    // DEFINIR AS OPÇÕES
    // e abrir o modal
    var params = {
      "createToken"       : "false",
      "amount"            : widget.settings['donation_value'+selected_value] + "00",
      "customerData"      : widget.settings.customer_data,
      "paymentMethods"    : widget.settings.payment_methods === "true" ? 'credit_card,boleto' : 'credit_card',
      "uiColor"           : widget.settings.main_color,
      "paymentButtonText" : widget.settings.button_text
    };
    checkout.open(params);
  }

  renderButton() {
    const { configurable, widget } = this.props
    const { loading, success, selected_value } = this.state

    let button_text = (widget.settings ? widget.settings.button_text : 'doe')
    let title_text = (widget.settings ? widget.settings.title_text : 'faça sua doação!')
    let donation_value1 = (widget.settings ? widget.settings.donation_value1 : 0)
    let donation_value2 = (widget.settings ? widget.settings.donation_value2 : 0)
    let donation_value3 = (widget.settings ? widget.settings.donation_value3 : 0)
    let donation_value4 = (widget.settings ? widget.settings.donation_value4 : 0)
    let donation_value5 = (widget.settings ? widget.settings.donation_value5 : 0)

    if (!configurable) {
      return (
        <div className="donation center clearfix">
          <h2 className="mb3">{title_text}</h2>
          <script dangerouslySetInnerHTML={{__html: `
(function(i,s,o,g,r,a,m){i['PagarMeCheckoutObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://assets.pagar.me/checkout/checkout.js','PagarMeCheckout');`}} />

          {donation_value1 > 0 ? <a href="#" onClick={::this.handleClickSetValueDonation.bind(this, 1)} className={selected_value === 1 ? 'p1 mx-auto block mb2 col-10 bg-darken-3' : 'p1 mx-auto block mb2 col-10 bg-darken-2'}>{"R$ " + donation_value1}</a> : ''}
          {donation_value2 > 0 ? <a href="#" onClick={::this.handleClickSetValueDonation.bind(this, 2)} className={selected_value === 2 ? 'p1 mx-auto block mb2 col-10 bg-darken-3' : 'p1 mx-auto block mb2 col-10 bg-darken-2'}>{"R$ " + donation_value2}</a> : ''}
          {donation_value3 > 0 ? <a href="#" onClick={::this.handleClickSetValueDonation.bind(this, 3)} className={selected_value === 3 ? 'p1 mx-auto block mb2 col-10 bg-darken-3' : 'p1 mx-auto block mb2 col-10 bg-darken-2'}>{"R$ " + donation_value3}</a> : ''}
          {donation_value4 > 0 ? <a href="#" onClick={::this.handleClickSetValueDonation.bind(this, 4)} className={selected_value === 4 ? 'p1 mx-auto block mb2 col-10 bg-darken-3' : 'p1 mx-auto block mb2 col-10 bg-darken-2'}>{"R$ " + donation_value4}</a> : ''}
          {donation_value5 > 0 ? <a href="#" onClick={::this.handleClickSetValueDonation.bind(this, 5)} className={selected_value === 5 ? 'p1 mx-auto block mb2 col-10 bg-darken-3' : 'p1 mx-auto block mb2 col-10 bg-darken-2'}>{"R$ " + donation_value5}</a> : ''}

          <a href="#" onClick={::this.handleClickDonate} className="button bg-darken-4 mt2 mb1 ">{button_text}</a>
        </div>
      )
    }
  }

  renderOverlay() {
    const { editable, configurable } = this.props
    if (editable && !configurable && this.state.hasMouseOver) {
      return (
        <div
          className="absolute top-0 right-0 bottom-0 left-0 bg-darken-4 h1 bold flex flex-center"
          style={{zIndex: 9998}}>
          <div className="center full-width white">Clique para editar</div>
        </div>
      )
    }
  }

  renderForm() {
    const { editable, configurable } = this.props
    const className = classnames({'p3 bg-darken-3 relative': editable || !configurable})

    return (
      <div>
        <div className={className}>
          { this.renderButton() }
          { this.renderOverlay() }
        </div>
      </div>
    )
  }

  renderThankyouText() {
    return (
      <div className="p3 bg-darken-3 relative">
        <p>Obrigado por contribuir.</p>
      </div>
    )
  }

  render() {
    const {
      editable,
      mobilization: { header_font: headerFont }
    } = this.props

    const { success } = this.state

    return (
      <div>
        <div
          className={`widget ${headerFont}-header`}
          style={(editable ? {cursor: 'pointer'} : null)}
          onMouseEnter={::this.handleMouseEnter}
          onMouseLeave={::this.handleMouseLeave}
          onClick={::this.handleClick}>
          { success ? this.renderThankyouText() : this.renderForm() }
        </div>
      </div>
    )
  }
}
