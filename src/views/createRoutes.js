import React from 'react'
import { Route } from 'react-router'

import {
  Application,
  UserDashboard,
  MobilizationDashboard
} from '../../app/scripts/containers'

import {
  Login,
  Logout,
  ListMobilizations,
  NewMobilization,
  ShowMobilization,
  EditMobilization,
  MobilizationBasics,
  MobilizationCity,
  MobilizationAnalytics,
  NewBlock,
  FormWidgetFields,
  FormWidgetForm,
  MobilizationFonts,
  MobilizationSharing,
  RequireLogin
} from '../../app/scripts/pages'

export default function(store) {
  return (
    <Route component={Application}>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route component={RequireLogin} onEnter={RequireLogin.onEnter(store)}>
        <Route component={UserDashboard}>
          <Route path="/" component={ListMobilizations} />
          <Route path="/mobilizations/new" component={NewMobilization} />
          <Route path="/mobilizations/:mobilization_id/cityNew" component={MobilizationCity} />
          <Route component={MobilizationDashboard} >
            <Route path="/mobilizations/:mobilization_id/edit" component={EditMobilization} />
            <Route path="/mobilizations/:mobilization_id/basics" component={MobilizationBasics} />
            <Route path="/mobilizations/:mobilization_id/city" component={MobilizationCity} />
            <Route path="/mobilizations/:mobilization_id/analytics" component={MobilizationAnalytics} />
            <Route path="/mobilizations/:mobilization_id/fonts" component={MobilizationFonts} />
            <Route path="/mobilizations/:mobilization_id/sharing" component={MobilizationSharing} />
            <Route path="/mobilizations/:mobilization_id/blocks/new" component={NewBlock} />
            <Route path="/mobilizations/:mobilization_id/widgets/:widget_id/fields" component={FormWidgetFields} />
            <Route path="/mobilizations/:mobilization_id/widgets/:widget_id/form" component={FormWidgetForm} />
          </Route>
        </Route>
      </Route>
      <Route path="/mobilizations/:mobilization_id" component={ShowMobilization} />
    </Route>
  )
}
