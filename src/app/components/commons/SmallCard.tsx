import Link from 'next/link';
import styled from '@emotion/styled';

const CustomLink = styled(Link)`
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--card-header-border-color);
`;

interface Props {
  href: string;
  label: string;
}
export const SmallCard = ({ href, label }: Props) => {
  return <CustomLink href={href}>{label}</CustomLink>;
};
