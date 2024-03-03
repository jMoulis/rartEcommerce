'use client';

import { IInvoice } from '@/src/types/DBTypes';
import React from 'react';
import styled from '@emotion/styled';
import { CreateFormHeader } from '../../products/CreateForm/CreateFormHeader';
import { useTranslations } from 'next-intl';
import { Article } from '../../products/CreateForm/Article';
import { Flexbox } from '../../../commons/Flexbox';
import LineItems from './LineItems';
import { format } from 'date-fns';
import { ButtonAnchorLink } from '../../../client/checkout/processing/commons/ButtonLink';
import Link from 'next/link';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';

const Root = styled.div`
  overflow: auto;
  position: relative;
`;
const Label = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;
interface Props {
  initialInvoice?: IInvoice;
}

export const InvoiceDetail = ({ initialInvoice }: Props) => {
  const t = useTranslations();

  return (
    <Root>
      <CreateFormHeader
        form={{ ...initialInvoice, name: initialInvoice?.invoiceId } as any}
        headerTitle='Title'
      />
      <Flexbox>
        <Flexbox
          flexDirection='column'
          flex='1'
          style={{
            marginRight: '10px',
          }}>
          <Flexbox flex='1'>
            <Article
              styling={{
                root: {
                  flex: '1',
                  marginRight: '10px',
                },
              }}
              headerTitle={t('Invoice.informations')}>
              <Flexbox>
                <Label>{t('commons.createdAt')}:</Label>
                {initialInvoice?.createdAt ? (
                  <>{format(initialInvoice?.createdAt, 'dd/MM/yyyy')}</>
                ) : null}
              </Flexbox>
              <Flexbox>
                <Label>{t('Invoice.issueDate')}:</Label>
                {initialInvoice?.issueDate ? (
                  <>{format(initialInvoice?.issueDate, 'dd/MM/yyyy')}</>
                ) : null}
              </Flexbox>
              <Flexbox>
                <Label>{t('Invoice.status')}:</Label>
                <span>{initialInvoice?.status}</span>
              </Flexbox>
              <Flexbox>
                <Label>{t('Invoice.amount')} HT:</Label>
                <span>{initialInvoice?.ht}</span>
              </Flexbox>
              <Flexbox>
                <Label>{t('Invoice.amount')} TVA:</Label>
                <span>{initialInvoice?.taxes}</span>
              </Flexbox>
              <Flexbox>
                <Label>{t('Invoice.amount')} TTC:</Label>
                <span>{initialInvoice?.amount}</span>
              </Flexbox>
            </Article>
            <Article
              styling={{
                root: {
                  flex: '1',
                },
              }}
              headerTitle={t('Customer.customer')}>
              {initialInvoice?.customerInformations
                ? Object.keys(initialInvoice.customerInformations).map(
                    (valueKey, index) =>
                      valueKey === 'address' ? null : (
                        <Flexbox key={index}>
                          <Label>{valueKey}</Label>:
                          <span>
                            {
                              (initialInvoice.customerInformations as any)?.[
                                valueKey
                              ]
                            }
                          </span>
                        </Flexbox>
                      )
                  )
                : null}
              <Link
                href={`${ENUM_ROUTES.CUSTOMERS}/${initialInvoice?.customerId}`}>
                {t('commons.seeMore')}
              </Link>
            </Article>
          </Flexbox>
          <Article headerTitle={t('Invoice.details')}>
            <LineItems items={initialInvoice?.lineItems ?? []} />
          </Article>
        </Flexbox>
        <Article headerTitle={t('Invoice.documents')}>
          <ButtonAnchorLink
            style={{
              marginBottom: '10px',
            }}
            download={`${initialInvoice?.invoiceId}.pdf`}
            target='_blank'
            href={initialInvoice?.invoiceUrl ?? ''}>
            {t('Invoice.invoice')}
          </ButtonAnchorLink>
          <ButtonAnchorLink
            download={`${initialInvoice?.invoiceId}.pdf`}
            target='_blank'
            href={initialInvoice?.receiptUrl ?? ''}>
            {t('Invoice.receipt')}
          </ButtonAnchorLink>
        </Article>
      </Flexbox>
    </Root>
  );
};
