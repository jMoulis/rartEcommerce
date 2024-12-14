import { useLocale, useTranslations } from 'next-intl';

import Image from 'next/image';
import { Button } from '../commons/Buttons/Button';
import { Menu } from '@mui/material';
import { useMenu } from '../hooks/useMenu';
import { useTransition } from 'react';
import styled from '@emotion/styled';
import { locales, usePathname, useRouter } from '@/src/i18n/routing';

const Text = styled.span`
  color: var(--default-font-color);
  margin-left: 5px;
`;

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const { open, onCloseModal, onOpenModal, anchorEl } = useMenu();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }
  return (
    <>
      <Button
        style={{
          backgroundColor: 'transparent',
          padding: 0
        }}
        disabled={isPending}
        onClick={onOpenModal}>
        <Image
          alt={'cur'}
          src={`/images/locales/${locale}.png`}
          height={20}
          width={20}
        />
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={onCloseModal}>
        {locales.map((cur) => (
          <li key={cur}>
            <Button
              style={{
                backgroundColor: 'transparent',
                padding: 0,
                marginBottom: '5px'
              }}
              onClick={() => onSelectChange(cur)}>
              <Image
                alt={'cur'}
                src={`/images/locales/${cur}.png`}
                height={20}
                width={20}
              />
              <Text>
                {t('locale', {
                  locale: cur
                })}
              </Text>
            </Button>
          </li>
        ))}
      </Menu>
    </>
  );
}
