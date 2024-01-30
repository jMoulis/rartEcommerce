'use client';

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../../../commons/Flexbox';
import { useTranslations } from 'next-intl';
import { Subtitle } from '../../commons/typography/Subtitle';
import { InputGroup } from '../../../commons/form/InputGroup';
import { TextareaGroup } from '../../../commons/form/TextareaGroup';
import { Button } from '../../../commons/Buttons/Button';
import { IContactMail } from '@/src/app/[locale]/api/email/type';
import { APIResponse } from '@/src/types/types';
import ReCAPTCHA from 'react-google-recaptcha';
import { DeliveredMessage } from './DeliveredMessage';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';

const Root = styled(Flexbox)`
  align-items: center;
  justify-content: space-between;
  flex: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TextWrapper = styled.ul`
  list-style-type: disc;
  margin-left: 20px;
  & * {
    color: #fff;
  }
`;
const CustomButton = styled(Button)`
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 16px;
`;

const CustomSubtitle = styled(Subtitle)`
  font-size: 28px;
  margin-bottom: 20px;
  text-align: start;
`;
const ListItem = styled.li`
  margin-bottom: 20px;
`;
const Text = styled.p`
  color: #fff;
  margin: 10px;
`;
const Form = styled.form`
  position: relative;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Wrapper = styled(Flexbox)`
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const coords = [
  {
    key: 'formContact',
    params: null,
    type: 'text',
  },
  {
    key: 'email',
    params: 'contact@rartcreation.fr',
    type: 'mailto',
  },
  {
    key: 'phone',
    params: '+33 (0)6 16 22 49 28',
    type: 'phone',
  },
];

const defaultInputStyle = (sending: boolean) => ({
  root: {
    transition: 'opacity 150ms ease',
    flex: 1,
    margin: '10px',
    opacity: sending ? '0.2' : '1',
  },
  label: {
    color: '#fff',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid transparent',
    color: '#fff',
  },
});
interface Props {}

export const ContactForm = (props: Props) => {
  const t = useTranslations();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (success) {
        setSuccess(false);
      }
    };
  }, [success]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const mailSystem = process.env.NEXT_PUBLIC_MAIL_SYSTEM;
    const token = captchaRef.current?.getValue();
    captchaRef.current.reset();
    if (!name || !email || !message || !mailSystem) return false;
    const rawFormData: IContactMail = {
      name,
      email,
      message,
      companyName: 'RartCreation',
      contactName: 'Rachel',
      mailSystem,
      subject: t('Contact.subject', {
        company: 'RartCreation',
      }),
      token,
    };
    const payload = {
      method: 'POST',
      body: JSON.stringify(rawFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      setSending(true);
      const response = await fetch('/api/email', payload);
      const p = (await response.json()) as unknown as APIResponse;
      if (p.error) throw Error(p.error);
      setSuccess(p.success);
      setSending(false);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSending(false);
      setSuccess(false);
    }
  };

  const renderText = useCallback(
    ({
      type,
      params,
    }: {
      key: string;
      params: string | null;
      type: string;
    }) => {
      switch (type) {
        case 'mailto':
          return (
            <a
              style={{
                textDecoration: 'underline',
              }}
              href={`mailto:${params}`}>
              {params}
            </a>
          );
        case 'phone':
          return (
            <a
              style={{
                textDecoration: 'underline',
              }}
              href={`tel:${params}`}>
              {params}
            </a>
          );
        default:
          return <Text>{params}</Text>;
      }
    },
    []
  );

  return (
    <>
      <Root>
        <Wrapper flex='1' flexDirection='column' justifyContent='flex-start'>
          <CustomSubtitle>{t('Contact.title')}</CustomSubtitle>
          <TextWrapper>
            {coords.map((coord, key) => (
              <ListItem key={key}>
                <Flexbox alignItems='center'>
                  <Text
                    style={{
                      marginRight: '5px',
                    }}>
                    {t(`Contact.coords.${coord.key}` as any)}
                  </Text>
                  <div
                    style={{
                      marginLeft: 0,
                    }}>
                    {renderText(coord)}
                  </div>
                </Flexbox>
              </ListItem>
            ))}
          </TextWrapper>
        </Wrapper>
        {success ? (
          <DeliveredMessage onClick={() => setSuccess(false)} />
        ) : (
          <Form onSubmit={handleSubmit}>
            {error ? <ErrorMessage message={error} /> : null}
            <Loader sending={sending} />
            <Flexbox flexWrap='wrap'>
              <InputGroup
                styling={defaultInputStyle(sending)}
                label={t('Contact.name')}
                name='name'
                id='name'
                required
              />
              <InputGroup
                styling={defaultInputStyle(sending)}
                label={t('Contact.email')}
                name='email'
                id='email'
                required
                type='email'
              />
            </Flexbox>
            <TextareaGroup
              label={t('Contact.message')}
              name='message'
              id='message'
              styling={defaultInputStyle(sending)}
              required
            />
            <Flexbox
              alignItems='center'
              justifyContent='space-between'
              style={{
                marginTop: '20px',
                marginRight: '10px',
                marginLeft: '10px',
              }}>
              {!loaded ? <span>{t('Contact.securityLoading')}</span> : null}
              <ReCAPTCHA
                asyncScriptOnLoad={() => setLoaded(true)}
                ref={captchaRef}
                sitekey={
                  process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as unknown as string
                }
                onChange={() => setValid(true)}
              />
              <CustomButton disabled={!valid} type='submit'>
                {t('Contact.send')}
              </CustomButton>
            </Flexbox>
          </Form>
        )}
      </Root>
    </>
  );
};
