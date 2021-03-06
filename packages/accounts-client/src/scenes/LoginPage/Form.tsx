import React from 'react';
import {
  Button,
  ConnectedForm,
  InputField,
  Link as LinkStyled,
  Validators,
} from 'bonde-components';
import { Container, Row, Col } from 'react-grid-system';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { composeValidators, required, isEmail, min } = Validators;

interface LoginFormProps {
  onSubmit: any;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation('auth');

  return (
    <Container fluid style={{ width: '100%', padding: '0' }}>
      <ConnectedForm onSubmit={onSubmit}>
        {({ submitting }: any) => (
          <>
            <InputField
              name='email'
              label={t('fields.email.label')}
              placeholder={t('fields.email.placeholder')}
              validate={composeValidators(
                required(t('fields.email.errors.isEmpty')),
                isEmail(t('fields.email.errors.isEmail'))
              )}
            />
            <InputField
              name='password'
              label={t('fields.password.label')}
              placeholder={t('fields.password.placeholder')}
              type='password'
              validate={composeValidators(
                required(t('fields.password.errors.isEmptyLogin')),
                min(6, t('fields.password.errors.min'))
              )}
            />
            <Row align='center'>
              <Col sm={6}>
                <LinkStyled component={Link} to='/forget-password'>
                  {t('links.forgetPassword')}
                </LinkStyled>
              </Col>
              <Col sm={6}>
                <Button type='submit' disabled={submitting}>
                  {t('button.submit')}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </ConnectedForm>
    </Container>
  );
};

export default LoginForm;