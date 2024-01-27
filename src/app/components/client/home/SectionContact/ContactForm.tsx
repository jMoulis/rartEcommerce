import React, { FormEvent, useCallback } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../../../commons/Flexbox';
import { useTranslations } from 'next-intl';
import { Subtitle } from '../../commons/typography/Subtitle';
import { InputGroup } from '../../../commons/form/InputGroup';
import { TextareaGroup } from '../../../commons/form/TextareaGroup';
import { Button } from '../../../commons/Buttons/Button';

const Root = styled(Flexbox)`
  align-items: center;
  justify-content: space-between;
  flex: 1;
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
  width: 50%;
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

const defaultInputStyle = {
  root: {
    flex: 1,
    margin: '10px',
  },
  label: {
    color: '#fff',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid transparent',
    color: '#fff',
  },
};
interface Props {}

export const ContactForm = (props: Props) => {
  const t = useTranslations();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name: string | undefined = (event.target as any).name?.value;
    const email: string | undefined = (event.target as any).email?.value;
    const message: string | undefined = (event.target as any).message?.value;
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
    <Root>
      <Flexbox
        style={{
          width: '50%',
        }}
        flex='1'
        flexDirection='column'
        justifyContent='flex-start'>
        <CustomSubtitle>{t('Contact.title')}</CustomSubtitle>
        <TextWrapper>
          {coords.map((coord, key) => (
            <ListItem key={key}>
              <Flexbox>
                <Text
                  style={{
                    marginRight: '5px',
                  }}>
                  {t(`Contact.coords.${coord.key}` as any)}
                </Text>
                <Text
                  style={{
                    marginLeft: 0,
                  }}>
                  {renderText(coord)}
                </Text>
              </Flexbox>
            </ListItem>
          ))}
        </TextWrapper>
      </Flexbox>
      <Form onSubmit={handleSubmit}>
        <Flexbox>
          <InputGroup
            styling={defaultInputStyle}
            label={t('Contact.name')}
            name='name'
            id='name'
            required
          />
          <InputGroup
            styling={defaultInputStyle}
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
          styling={defaultInputStyle}
          required
        />
        <Flexbox
          alignItems='center'
          style={{
            marginTop: '20px',
            marginRight: '10px',
            marginLeft: '10px',
          }}>
          <Text>
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </Text>
          <CustomButton type='submit'>{t('Contact.send')}</CustomButton>
        </Flexbox>
      </Form>
    </Root>
  );
};
