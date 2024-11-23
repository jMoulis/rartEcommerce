import { usePathname } from '@/src/navigation';
import { faHome } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const Root = styled.nav`
  padding: 10px;
  margin: 10px;
`;
const List = styled.ul`
  display: flex;
  align-items: center;
`;
const CustomLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

interface Props {
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  text: string;
  customPaths?: string[];
}

const Breadcrumb = ({
  listClasses,
  activeClasses,
  text,
  customPaths
}: Props) => {
  const pathname = usePathname();
  const pathNames = customPaths ?? pathname.split('/').filter((path) => path);
  const t = useTranslations();

  return (
    <Root>
      <List>
        <li>
          <Link href={'/'}>
            <FontAwesomeIcon icon={faHome as any} />
          </Link>
        </li>
        {pathNames.length > 0 && (
          <span
            style={{
              margin: '0 5px'
            }}>
            {'>'}
          </span>
        )}
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const itemClasses =
            pathname === href ? `${listClasses} ${activeClasses}` : listClasses;

          const itemLink = link;
          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <CustomLink href={href}>
                  {index >= 1
                    ? text
                    : t(`Breadcrumb.${itemLink.toLowerCase() as any}` as any)}
                </CustomLink>
              </li>
              {pathNames.length !== index + 1 && (
                <span
                  style={{
                    margin: '0 5px'
                  }}>
                  {'>'}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Root>
  );
};
export default Breadcrumb;
