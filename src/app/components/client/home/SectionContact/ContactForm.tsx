'use client';

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../../../commons/Flexbox';
import { useTranslations } from 'next-intl';
import { Subtitle } from '../../commons/typography/Subtitle';
import { InputGroup } from '../../../commons/form/InputGroup';
import { TextareaGroup } from '../../../commons/form/TextareaGroup';
import { Button } from '../../../commons/Buttons/Button';
import { IContactMail } from '@/src/app/api/contact/type';
import { APIResponse } from '@/src/types/types';
import ReCAPTCHA from 'react-google-recaptcha';
import { DeliveredMessage } from './DeliveredMessage';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { faEnvelope, faPhone } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const Root = styled(Flexbox)`
  align-items: center;
  justify-content: space-between;
  flex: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SectionWrapper = styled(Flexbox)`
  margin: 20px;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const TextWrapper = styled.ul`
  list-style-type: disc;
  margin-left: 20px;
  & * {
  }
`;
const CustomButton = styled(Button)`
  border-radius: 10px;
  padding: 12px 16px;
  flex: 1;
  justify-content: center;
  background-color: var(--action-button-color);
  @media (max-width: 768px) {
    margin: 0;
    margin-top: 10px;
  }
`;

const CustomSubtitle = styled(Subtitle)`
  font-size: 20px;
  margin-bottom: 20px;
  text-align: start;
`;
const ListItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;
const Text = styled.p`
  margin: 10px;
  @media (max-width: 768px) {
    margin: 0;
  }
`;
const Form = styled.form`
  position: relative;
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
    key: 'email',
    params: 'contact@rartcreation.fr',
    type: 'mailto',
    icon: faEnvelope
  },
  {
    key: 'phone',
    params: '+33 (0)6 16 22 49 28',
    type: 'phone',
    icon: faPhone
  }
];

const defaultInputStyle = (sending: boolean) => ({
  root: {
    transition: 'opacity 150ms ease',
    flex: 1,
    margin: '10px',
    opacity: sending ? '0.2' : '1'
  },
  label: {},
  input: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    border: '1px solid transparent'
  }
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
      companyName: process.env.NEXT_COMPANY_NAME! || 'Rart création',
      contactName: process.env.NEXT_CONTACT_NAME! || 'Rachel',
      mailSystem,
      subject: t('Contact.subject', {
        company: process.env.NEXT_COMPANY_NAME! || 'Rart création'
      }),
      token
    };
    const payload = {
      method: 'POST',
      body: JSON.stringify(rawFormData),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      setSending(true);
      const response = await fetch('/api/contact', payload);
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
      icon
    }: {
      key: string;
      params: string | null;
      type: string;
      icon: IconProp;
    }) => {
      switch (type) {
        case 'mailto':
          return (
            <a
              style={{
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center'
              }}
              href={`mailto:${params}`}>
              <FontAwesomeIcon icon={icon} />
              {params}
            </a>
          );
        case 'phone':
          return (
            <a
              style={{
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center'
              }}
              href={`tel:${params}`}>
              <FontAwesomeIcon icon={icon} />
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
        <Wrapper flex='1' justifyContent='flex-start'>
          <SectionWrapper flexDirection='column' flex='1'>
            <CustomSubtitle>{t('Contact.completeForm')}</CustomSubtitle>
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
                  flexWrap='wrap'
                  style={{
                    margin: '10px'
                  }}
                  justifyContent='flex-end'>
                  {!loaded ? <span>{t('Contact.securityLoading')}</span> : null}
                  <ReCAPTCHA
                    asyncScriptOnLoad={() => setLoaded(true)}
                    ref={captchaRef}
                    sitekey={
                      process.env
                        .NEXT_PUBLIC_CAPTCHA_SITE_KEY as unknown as string
                    }
                    onChange={() => setValid(true)}
                  />
                </Flexbox>
                <Flexbox>
                  <CustomButton disabled={!valid} type='submit'>
                    {t('Contact.send')}
                  </CustomButton>
                </Flexbox>
              </Form>
            )}
          </SectionWrapper>
          <SectionWrapper flexDirection='column' flex='1'>
            <CustomSubtitle>{t('Contact.completeForm')}</CustomSubtitle>
            <TextWrapper>
              {coords.map((coord, key) => (
                <ListItem key={key}>
                  <Flexbox alignItems='center'>
                    {/* <Text
                      style={{
                        marginRight: '5px',
                      }}>
                      {t(`Contact.coords.${coord.key}` as any)}
                    </Text> */}
                    <div
                      style={{
                        marginLeft: 0
                      }}>
                      {renderText(coord as any)}
                    </div>
                  </Flexbox>
                </ListItem>
              ))}
            </TextWrapper>
          </SectionWrapper>
        </Wrapper>
      </Root>
    </>
  );
};
