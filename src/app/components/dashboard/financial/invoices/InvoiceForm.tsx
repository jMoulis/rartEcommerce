'use client';

import {
  IContactInformations,
  ICustomer,
  IInvoice,
  IInvoiceInput,
  ILineItem,
  IProductService
} from '@/src/types/DBTypes';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { CreateFormHeader } from '../../products/CreateForm/CreateFormHeader';
import { useTranslations } from 'next-intl';
import { Article } from '../../products/CreateForm/Article';
import { Flexbox } from '../../../commons/Flexbox';
import LineItems from './LineItems';
import { ButtonAnchorLink } from '../../../client/checkout/commons/ButtonLink';
import Link from 'next/link';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';
import { useForm } from '../../../hooks/useForm';
import { generateDefaultInvoice } from '../../products/CreateForm/defaultData';
import { InputGroup } from '../../../commons/form/InputGroup';
import SelectCustomerModal from './SelectCustomerModal';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Selectbox } from '../../../commons/form/Selectbox';
import SelectItemsModal from './SelectItemsModal';
import { v4 } from 'uuid';
import ManualLineItemModal from './ManualLineItemModal';
import { Textarea } from '../../../commons/form/Textarea';

const Root = styled.div`
  overflow: auto;
  position: relative;
`;
const Label = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;
const HeaderTitle = styled.span`
  display: block;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  font-size: 30px;
  border: 1px solid transparent;
  &:focus {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
interface Props {
  initialInvoice?: IInvoice;
  estimate?: boolean;
}
export const InvoiceForm = ({ initialInvoice, estimate }: Props) => {
  const t = useTranslations();

  const { form, onInitForm, onInputChange, onDirectMutation } =
    useForm<IInvoiceInput>({} as any);
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    if (initialInvoice) {
      onInitForm(initialInvoice);
    } else {
      const newInvoice = generateDefaultInvoice();
      onInitForm(newInvoice);
    }
  }, [initialInvoice]);
  const router = useRouter();
  const handleSelectLineItem = (item: IProductService, remove: boolean) => {
    const lineItem = {
      _id: v4(),
      itemId: item._id!,
      description: item.name,
      quantity: 1,
      unitPrice: item.price,
      total: item.price * 1
    };

    onDirectMutation((prev) => {
      let updatedLineItems = [...prev.lineItems];
      if (remove) {
        updatedLineItems = updatedLineItems.filter(
          (prevItem) => prevItem.itemId !== lineItem.itemId
        );
      } else {
        updatedLineItems = [...updatedLineItems, lineItem];
      }
      const calculateLinesTotal = updatedLineItems.reduce(
        (acc, current) => acc + current.total,
        0
      );
      return {
        ...prev,
        lineItems: updatedLineItems,
        ht: calculateLinesTotal,
        amount: calculateLinesTotal
      };
    });
  };
  const handleAddManualLineItem = (item: ILineItem) => {
    onDirectMutation((prev) => {
      let updatedLineItems = [...prev.lineItems];
      updatedLineItems = [...updatedLineItems, item];
      const calculateLinesTotal = updatedLineItems.reduce(
        (acc, current) => acc + current.total,
        0
      );
      return {
        ...prev,
        lineItems: updatedLineItems,
        ht: calculateLinesTotal,
        amount: calculateLinesTotal
      };
    });
  };
  const handleSelectCustomer = (customer: ICustomer) => {
    const contactInformations: IContactInformations = {
      _id: customer._id!,
      companyName: customer.companyName!,
      firstname: customer.firstname!,
      lastname: customer.lastname!,
      email: customer.email,
      address: customer.addresses?.[0]
    };
    onDirectMutation((prev) => ({
      ...prev,
      customerId: customer._id,
      customerInformations: contactInformations
    }));
  };
  const handleDeleteLineItem = (lineId: string) => {
    onDirectMutation((prev) => {
      const updatedLineItems = prev.lineItems.filter(
        (prevItem) => prevItem._id !== lineId
      );
      const calculateLinesTotal = updatedLineItems.reduce(
        (acc, current) => acc + current.total,
        0
      );
      return {
        ...prev,
        lineItems: updatedLineItems,
        ht: calculateLinesTotal,
        amount: calculateLinesTotal
      };
    });
  };
  const handleSubmit = async () => {
    try {
      setSaving(true);

      fetch(ENUM_ROUTES.CREATE_INVOICE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice: form, estimate })
      })
        .then(async (response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(({ data }) => {
          setSaving(false);
          const replaceUrl = estimate
            ? ENUM_ROUTES.ESTIMATES
            : ENUM_ROUTES.INVOICE_DETAIL;
          router.replace(`${replaceUrl}/${data?._id}`);
        })
        .catch((error) => {
          throw new Error(error);
        })
        .finally(() => {
          setSaving(false);
        });
    } catch (error) {
      setSaving(false);
    }
  };
  const handleChangeListItemQuantity = (id: string, quantity: number) => {
    onDirectMutation((prev) => {
      const updatedLineItems = prev.lineItems.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            quantity,
            total: item.unitPrice * quantity
          };
        }
        return item;
      });
      const calculateLinesTotal = updatedLineItems.reduce(
        (acc, current) => acc + current.total,
        0
      );
      return {
        ...prev,
        lineItems: updatedLineItems,
        ht: calculateLinesTotal,
        amount: calculateLinesTotal
      };
    });
  };
  return (
    <Root>
      <CreateFormHeader
        InputHeader={
          <HeaderTitle>
            {estimate ? 'Devis' : 'Facture'} n° {form.invoiceId}
          </HeaderTitle>
        }
        form={{ ...form, name: estimate ? 'Devis' : 'Facture' } as any}
        headerTitle={estimate ? 'Devis' : 'Facture'}
        onSubmit={handleSubmit}
        saving={saving}
      />
      <Flexbox>
        <Flexbox
          flexDirection='column'
          flex='1'
          style={{
            marginRight: '10px'
          }}>
          <Flexbox flex='1'>
            <Article
              styling={{
                root: {
                  flex: '1',
                  marginRight: '10px'
                }
              }}
              headerTitle={t('Invoice.informations')}>
              <InputGroup
                id='createdAt'
                name='createdAt'
                label={t('commons.createdAt')}
                onInputChange={onInputChange}
                value={
                  form.createdAt
                    ? format(new Date(form.createdAt), 'yyyy-MM-dd')
                    : ''
                }
                type='date'
              />
              <InputGroup
                id='issueDate'
                name='issueDate'
                label={t('Invoice.issueDate')}
                onInputChange={onInputChange}
                value={
                  form.issueDate
                    ? format(new Date(form.issueDate), 'yyyy-MM-dd')
                    : ''
                }
                type='date'
              />
              <Flexbox flexDirection='column'>
                <Label>{t('Invoice.status')}:</Label>
                <Selectbox
                  id='status'
                  onChangeSelectbox={onInputChange}
                  name='status'
                  value={form.status}
                  options={[
                    {
                      label: t('Invoice.paid'),
                      value: 'paid'
                    },
                    {
                      label: t('Invoice.unpaid'),
                      value: 'unpaid'
                    }
                  ]}
                />
              </Flexbox>
              <Flexbox>
                <Label>{t('Invoice.amount')} TTC:</Label>
                <span>{form?.amount}</span>
              </Flexbox>
            </Article>
            <Article
              actions={
                <SelectCustomerModal onSelectItem={handleSelectCustomer} />
              }
              styling={{
                root: {
                  flex: '1'
                }
              }}
              headerTitle={t('Customer.customer')}>
              <Flexbox
                style={{
                  marginBottom: '3px'
                }}>
                <Label>{t('commons.companyName')}</Label>:
                <span>{form.customerInformations?.companyName}</span>
              </Flexbox>
              <Flexbox
                style={{
                  marginBottom: '3px'
                }}>
                <Label>{t('commons.name')}</Label>:
                <Flexbox>
                  <span
                    style={{
                      marginRight: '5px'
                    }}>
                    {form.customerInformations?.firstname}
                  </span>
                  <span>{form.customerInformations?.lastname}</span>
                </Flexbox>
              </Flexbox>
              <Flexbox
                style={{
                  marginBottom: '3px'
                }}>
                <Label>{t('commons.email')}</Label>:
                <span>{form.customerInformations?.email}</span>
              </Flexbox>
              <Link href={`${ENUM_ROUTES.CUSTOMERS}/${form?.customerId}`}>
                {t('commons.seeMore')}
              </Link>
              <Label
                style={{
                  marginTop: '10px',
                  marginBottom: '5px'
                }}>
                {t('Invoice.comment')}:
              </Label>
              <Textarea
                name='comment'
                value={form.comment}
                onChange={onInputChange}
              />
            </Article>
          </Flexbox>
          <Article
            headerTitle={t('Invoice.details')}
            actions={
              <Flexbox>
                <SelectItemsModal
                  onSelectItem={handleSelectLineItem}
                  selectedLineItems={form?.lineItems ?? []}
                />
                <ManualLineItemModal
                  onAddManualLineItem={handleAddManualLineItem}
                />
              </Flexbox>
            }>
            <LineItems
              onChangeQuantity={handleChangeListItemQuantity}
              items={form?.lineItems || []}
              onDeleteItem={handleDeleteLineItem}
            />
          </Article>
        </Flexbox>
        <Article headerTitle={t('Invoice.documents')}>
          <ButtonAnchorLink
            style={{
              marginBottom: '10px'
            }}
            download={`${form?.invoiceId}.pdf`}
            target='_blank'
            href={form?.invoiceUrl ?? ''}>
            {t('Invoice.invoice')}
          </ButtonAnchorLink>
          <ButtonAnchorLink
            download={`${form?.invoiceId}.pdf`}
            target='_blank'
            href={form?.receiptUrl ?? ''}>
            {t('Invoice.receipt')}
          </ButtonAnchorLink>
        </Article>
      </Flexbox>
    </Root>
  );
};
