import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Login as WittLogin } from '@witt-team/athens-component-library';
import { useIntl } from 'react-intl';
import cs from 'classnames';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';

import styles from '../styles/pages/Login.module.scss';
import {
  loginUser,
  selectError,
  selectStatus
} from '../store/reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import { LoginData } from '../types/data.types';
import { validateEmail } from '../utils/checkers';

import { generateCustomerCart } from '../store/reducers/cartSlice';
import SeoMetaData from '../components/globals/SeoMetaData';

const MY_PROJECTS_ROUTE = '/my-projects';

const TOKEN_KEY = 'token';
const CART_TOKEN_KEY = 'cartToken';

const Login = () => {
  const router = useRouter();
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectError);
  const isLoading = useMemo(() => status === 'loading', [status]);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('r')) {
          router.push(params.get('r') ?? MY_PROJECTS_ROUTE);
        }
      } else {
        router.push(MY_PROJECTS_ROUTE);
      }
    }
  }, []);

  const loginMsg = intl.formatMessage({ id: 'login.LOGIN' });
  const loginFormDescMsg = intl.formatMessage({
    id: 'login.LOGIN_FORM_DESCRIPTION'
  });
  const forgotPasswordMsg = intl.formatMessage({
    id: 'login.FORGOT_PASSWORD'
  });
  const createAccountMsg = intl.formatMessage({
    id: 'common.CREATE_ACCOUNT'
  });

  const onSubmit = async (data: LoginData) => {
    const response = await dispatch(loginUser(data));
    if (response.meta.requestStatus === 'fulfilled') {
      const token = response.payload;
      localStorage.setItem(TOKEN_KEY, token);
      const responseCart = await dispatch(generateCustomerCart());
      localStorage.setItem(CART_TOKEN_KEY, responseCart.payload);

      if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('r')) {
          router.push(params.get('r') ?? MY_PROJECTS_ROUTE);
        }
      } else {
        router.push(MY_PROJECTS_ROUTE);
      }
    }
  };

  const validatePassword = (): boolean => true;

  return (
    <>
      <SeoMetaData />
      <WittLogin
        className={cs(styles.Login)}
        pageTitle="" // we don't need section-header
        formTitle={loginMsg}
        formDescription={loginFormDescMsg}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onSubmit={onSubmit}
        validateEmail={validateEmail}
        validatePassword={validatePassword}
        forgotPasswordLink={{ url: '/#', text: forgotPasswordMsg }}
        createAccountLink={{ url: '/#', text: createAccountMsg }}
      />
      <EmptySeparatorBlock />
    </>
  );
};

export default Login;
