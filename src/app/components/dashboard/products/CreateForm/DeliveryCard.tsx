import {
  IAddress,
  IProductService,
  IShippingRequest,
  IVendor
} from '@/src/types/DBTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import { Article } from './Article';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { Button } from '../../../commons/Buttons/Button';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useToggle } from '../../../hooks/useToggle';
import { useUserSession } from '@/src/app/contexts/auth/hooks/useUserSession';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findDocumentById } from '@/src/app/contexts/firestore/useFirestore';
import { Flexbox } from '../../../commons/Flexbox';
import { Selectbox } from '../../../commons/form/Selectbox';
import { listCountriesCodes } from './utils';
import { fetchShippingMethods } from '../../actions';
import { toast } from 'react-toastify';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  form?: IProductService;
}
function DeliveryCard({ form, onChange }: Props) {
  const t = useTranslations('ProductForm');
  const { profile } = useUserSession();
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [venderShippingAddress, setVenderShippingAddress] =
    useState<IAddress | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const { open, onClose, onOpen } = useToggle();

  useEffect(() => {
    if (!open || !profile?.vendorId) return;
    findDocumentById(profile.vendorId, ENUM_COLLECTIONS.VENDORS).then(
      ({ data }) => {
        if (!data) return;
        const vendor = data as IVendor;
        const shippingAddress = vendor.shippingAddress;
        if (!shippingAddress) {
          setVenderShippingAddress(null);
          return;
        }
        setVenderShippingAddress(shippingAddress);
      }
    );
  }, [open, profile?.vendorId]);

  const handleSelectServicePoint = async (carrier: string) => {};
  const handleProvider = async (methodId: number) => {};
  const handleSelectDestination = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDestination(event.target.value);
  };
  const handleEstimateShipping = async () => {
    if (!selectedDestination || !venderShippingAddress || !form) return;

    const hardCodedUnits = {
      weight: 'gram',
      size: 'centimeter'
    };
    const generateProductProperties = (
      product: IProductService,
      venderShippingAddress: IAddress
    ) => {
      const shippingRequest: IShippingRequest = {
        from_country: venderShippingAddress.countryCode ?? 'FR',
        to_country: selectedDestination || '',
        from_postal_code: venderShippingAddress.postalCode || '',
        weight: product?.delivery?.weight
          ? String(product.delivery.weight)
          : '',
        weight_unit: product?.delivery?.weight ? hardCodedUnits.weight : '',
        height: product?.delivery?.height
          ? String(product.delivery.height)
          : '',
        height_unit: product?.delivery?.height ? hardCodedUnits.size : '',
        length: product?.delivery?.length
          ? String(product.delivery.length)
          : '',
        length_unit: product?.delivery?.length ? hardCodedUnits.size : '',
        width: product?.delivery?.width ? String(product.delivery.width) : '',
        width_unit: product?.delivery?.width ? hardCodedUnits.size : ''
      };
      const filteredRequest = Object.fromEntries(
        Object.entries(shippingRequest).filter(
          ([, value]) => value !== undefined && value !== ''
        )
      );
      // console.log(new URLSearchParams(filteredRequest as any).toString());
      // const url = 'https://panel.sendcloud.sc/api/v2/shipping-products?from_country=FR&to_country=BE&from_postal_code=74800';

      return filteredRequest as IShippingRequest;
    };
    const shippingRequest: IShippingRequest = generateProductProperties(
      form,
      venderShippingAddress
    );
    try {
      fetchShippingMethods(shippingRequest).then((data: any) => {
        setShippingMethods(data);
      });
    } catch (error) {
      toast.error('Error fetching shipping methods');
    }
  };
  return (
    <>
      <Article
        headerTitle={t('delivery')}
        styling={{
          root: {
            height: 'auto'
          },
          body: {
            flexWrap: 'wrap'
          }
        }}>
        <InputGroup
          label={`${t('width')}-${t('sizeUnit')}`}
          id='width'
          name='width'
          onChange={onChange}
          value={form?.delivery?.width ?? ''}
          styling={{
            root: {
              marginRight: '10px'
            }
          }}
        />
        <InputGroup
          label={`${t('height')}-${t('sizeUnit')}`}
          id='height'
          name='height'
          onChange={onChange}
          value={form?.delivery?.height ?? ''}
          styling={{
            root: {
              marginRight: '10px'
            }
          }}
        />
        <InputGroup
          label={`${t('weight')}-${t('weightUnit')}`}
          id='weight'
          name='weight'
          onChange={onChange}
          value={form?.delivery?.weight ?? ''}
          styling={{
            root: {
              marginRight: '10px'
            }
          }}
        />
        <InputGroup
          label={`${t('length')}-${t('sizeUnit')}`}
          id='length'
          name='length'
          onChange={onChange}
          value={form?.delivery?.length ?? ''}
          styling={{
            root: {
              marginRight: '10px'
            }
          }}
        />
        <Button onClick={onOpen}>{t('shipping.calculate')}</Button>
      </Article>
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'lg'
        }}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh'
          }
        }}
        header={{
          title: t('shipping.shippingCost')
        }}>
        {open ? (
          <div>
            <h1>Product detail</h1>
            <Flexbox>
              <span>Weight</span>
              <span>{form?.delivery?.weight}</span>
              <span>{t('weightUnit')}</span>
            </Flexbox>
            <Flexbox>
              <span>Height</span>
              <span>{form?.delivery?.height}</span>
              <span>{t('sizeUnit')}</span>
            </Flexbox>
            <Flexbox>
              <span>Width</span>
              <span>{form?.delivery?.width}</span>
              <span>{t('sizeUnit')}</span>
            </Flexbox>
            <Flexbox>
              <span>Length</span>
              <span>{form?.delivery?.length}</span>
              <span>{t('sizeUnit')}</span>
            </Flexbox>
            <div>
              <h1>Shipping address</h1>
            </div>
            <Flexbox>
              <span>Pays</span>
              <span>{venderShippingAddress?.country}</span>
            </Flexbox>
            <Flexbox>
              <span>Code postale</span>
              <span>{venderShippingAddress?.postalCode}</span>
            </Flexbox>
            <Flexbox>
              <span>Destinations</span>
              <Selectbox
                id='destination'
                name='destination'
                value={selectedDestination}
                onChangeSelectbox={handleSelectDestination}
                options={listCountriesCodes.map((country) => ({
                  value: country,
                  label: country
                }))}
              />
            </Flexbox>
            <Button onClick={handleEstimateShipping}>
              {t('shipping.calculate')}
            </Button>
            <ul>
              {shippingMethods.map((item: any) => (
                <li key={item.code}>
                  <div>{item.code}</div>
                  {item.service_points_carrier?.includes('mondial') ? (
                    <button
                      onClick={async () =>
                        handleSelectServicePoint(item.carrier)
                      }>
                      Select service point
                    </button>
                  ) : null}
                  <ul
                    style={{
                      marginLeft: '10px'
                    }}>
                    {item.methods.map((meth: any) => {
                      return (
                        <li
                          key={meth.id}
                          onClick={async () => handleProvider(meth.id)}>
                          <span>{meth.name}</span>

                          <ul>
                            {meth.prices.map(
                              (priceOption: any, key: number) => (
                                <li key={key}>
                                  <div>
                                    {priceOption.price}-{priceOption.currency}
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </FullDialog>
    </>
  );
}
export default DeliveryCard;
