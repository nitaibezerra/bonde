import React from "react";
import { Link } from "react-router-dom";
import { Shortcut, Icon } from "bonde-components";
import styled from "styled-components";
import { useTranslation } from 'react-i18next';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 205px));
  grid-gap: 20px;
  justify-content: start;
  overflow-x: auto;
  padding: 15px 0;
  & > a {
    text-decoration: none;
    & > button {
      width: 100%;
    }
  }
`;

type Props = {
  community: any, 
  storage: any
}

const Shortcuts = ({ community, storage }: Props): React.ReactElement => {
  const { t } = useTranslation('widgetActions');

  return (
    <Grid>
      <Shortcut
        onClick={() => {
          if (process.env.REACT_APP_DOMAIN_ADMIN) {
            storage.setAsyncItem("community", community).then(() => {
              window.location.href = new URL(
                `/mobilizations/new`,
                process.env.REACT_APP_DOMAIN_ADMIN
              ).href;
            });
          }
        }}
        text={t('home.shortcuts.buttons.newMobilization')}
        icon={<Icon name="Mobilization" size="default" />}
      />
      <Shortcut
        onClick={() => {
          if (process.env.REACT_APP_DOMAIN_ADMIN) {
            storage.setAsyncItem("community", community).then(() => {
              window.location.href = new URL(
                `/mobilizations`,
                process.env.REACT_APP_DOMAIN_ADMIN
              ).href;
            });
          }
        }}
        text={t('home.shortcuts.buttons.mobilizations')}
        icon={<Icon name="Bolt" size="default" />}
      />
      <Link to="/community/analytics">
        <Shortcut
          text={t('home.shortcuts.buttons.reports')}
          icon={<Icon name="Open" size="large" />}
        />
      </Link>
      <Link to="/community/domains">
        <Shortcut
          text={t('home.shortcuts.buttons.domains')}
          icon={<Icon name="Cloud" size="default" />}
        />
      </Link>
    </Grid>
  );
};

export default Shortcuts;
