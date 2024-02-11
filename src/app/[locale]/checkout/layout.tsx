import { Page } from '../../components/client/commons/layout/Page';
import { SectionHeader } from '../../components/commons/Layouts/SectionHeader';

interface Props {
  children: React.ReactNode;
}

export default async function CheckoutLayoutRoot({ children }: Props) {
  return (
    <Page>
      <SectionHeader />
      {children}
    </Page>
  );
}
