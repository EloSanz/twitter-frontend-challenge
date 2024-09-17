import { useState } from 'react';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthWrapper from '../../../pages/auth/AuthWrapper';
import LabeledInput from '../../../components/labeled-input/LabeledInput';
import Button from '../../../components/button/Button';
import { ButtonType } from '../../../components/button/StyledButton';
import { StyledH3 } from '../../../components/common/text';
import { useFormik } from 'formik';
import { useSignUp } from '../../../service/queryHooks';

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [error, setError] = useState(false);
  const { mutate } = useSignUp();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof SignUpData, string>> = {};
      if (!values.email) {
        errors.email = t('Email is required');
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = t('invalid Email, must be example@email.com');
      }
      if (!values.name) {
        errors.name = t('Name is required');
      }
      if (!values.username) {
        errors.username = t('Username is required');
      }
      if (!values.password) {
        errors.password = t('Password is required');
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = t('confirm password Required');
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = t('Different passwords');
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { confirmPassword, ...requestData } = values;
      mutate(requestData, {
        onSuccess: () => navigate('/'),
        onError: () => setError(true),
      });
    },
  });

  return (
    <AuthWrapper>
    <div className="border">
      <div className="container">
        <div className="header">
          <img src={logo} alt="Twitter Logo" />
          <StyledH3>{t('title.register')}</StyledH3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-container">
            <LabeledInput
              required
              placeholder="Enter name..."
              title={t('input-params.name')}
              error={formik.errors.name}
              onChange={formik.handleChange}
              value={formik.values.name}
              id="name"
            />
            <LabeledInput
              required
              placeholder="Enter username..."
              title={t('input-params.username')}
              error={formik.errors.username}
              onChange={formik.handleChange}
              value={formik.values.username}
              id="username"
            />
            <LabeledInput
              required
              placeholder="Enter email..."
              title={t('input-params.email')}
              error={formik.errors.email}
              onChange={formik.handleChange}
              value={formik.values.email}
              id="email"
            />
            <LabeledInput
              type="password"
              required
              placeholder="Enter password..."
              title={t('input-params.password')}
              error={formik.errors.password}
              onChange={formik.handleChange}
              value={formik.values.password}
              id="password"
            />
            <LabeledInput
              type="password"
              required
              placeholder="Confirm password..."
              title={t('input-params.confirm-password')}
              error={formik.errors.confirmPassword}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              id="confirmPassword"
            />
          </div>
          {error && <p className="error-message">{t('error.register')}</p>}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              text={t('buttons.register')}
              buttonType={ButtonType.FOLLOW}
              size="MEDIUM"
              onClick={() => formik.handleSubmit()}

            />
            <Button
              text={t('buttons.login')}
              buttonType={ButtonType.OUTLINED}
              size="MEDIUM"
              onClick={() => navigate('/sign-in')}
            />
          </div>
        </form>
      </div>
    </div>
  </AuthWrapper>
  );
};

export default SignUpPage;
