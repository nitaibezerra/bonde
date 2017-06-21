import PropTypes from 'prop-types'
import React from 'react'
import { FormGroup, FormControl, ControlLabel } from '~client/components/forms'
import { SettingsForm } from '~client/ux/components'
import { Info } from '~client/components/notify'

const CommunitySettingsMailchimpPage = ({
  fields: {
    mailchimp_api_key: mailchimpApiKey,
    mailchimp_list_id: mailchimpListId,
    mailchimp_group_id: mailchimpGroupId
  },
  location,
  ...formProps
}) => (
  <SettingsForm {...formProps}>
    <Info title='Informação'>
      A integração com o mailchimp é feita através da criação de segmentos de cada
      widget criada no BONDE. Adotamos o seguinte padrão no nome dos segmentos:
      M999P999, M999F999, M999D999
    </Info>
    <FormGroup controlId='apiKeyId' {...mailchimpApiKey}>
      <ControlLabel>Mailchimp API Key</ControlLabel>
      <FormControl type='text' />
    </FormGroup>
    <FormGroup controlId='listId' {...mailchimpListId}>
      <ControlLabel>Mailchimp ID da lista</ControlLabel>
      <FormControl type='text' />
    </FormGroup>
    <FormGroup controlId='groupId' {...mailchimpGroupId}>
      <ControlLabel>Mailchimp ID do grupo</ControlLabel>
      <FormControl type='text' />
    </FormGroup>
  </SettingsForm>
)

CommunitySettingsMailchimpPage.propTypes = {
  fields: PropTypes.shape({
    mailchimp_api_key: PropTypes.object.isRequired,
    mailchimp_list_id: PropTypes.object.isRequired,
    mailchimp_group_id: PropTypes.object.isRequired
  }).isRequired,
  // redux-form required props
  submit: PropTypes.func.isRequired
}

export default CommunitySettingsMailchimpPage
