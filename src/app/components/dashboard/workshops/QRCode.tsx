import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';
import { Article } from '../products/CreateForm/Article';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../commons/Flexbox';
import { Button } from '../../commons/Buttons/Button';

interface Props {
  value: string;
}

const QRCode = ({ value }: Props) => {
  const t = useTranslations();
  const handleDownload = () => {
    const canvasElement = document.getElementById(
      'qr-code'
    ) as HTMLCanvasElement | null;
    if (canvasElement) {
      const link = document.createElement('a');
      link.download = 'filename.png';
      link.href = canvasElement.toDataURL();
      link.click();
    }
  };
  return (
    <Article headerTitle=''>
      <Flexbox flexDirection='column' flex='1' alignItems='center'>
        <QRCodeCanvas
          id='qr-code'
          size={256}
          style={{ height: '100px', width: '100px', marginBottom: '20px' }}
          value={value}
        />
        <Button onClick={handleDownload}>{t('commons.download')}</Button>
      </Flexbox>
    </Article>
  );
};

export default QRCode;
