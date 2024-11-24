import styled from '@emotion/styled';
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ENUM_ROUTES } from '../navbar/routes.enums';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons';

const List = styled.ul`
  display: flex;
`;
const ListItem = styled.li`
  margin: 0 5px;
`;

const Link = styled.a`
  background-color: #cce5ff;
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 150ms ease;
  & * {
    color: var(--primary-color);
    font-size: 20px;
  }
  &:hover {
    & * {
      color: #cce5ff;
    }
    background-color: var(--primary-color);
  }
`;

export const SocialNetworks = () => {
  const socialNetworks = [
    {
      label: 'instagram',
      icon: faInstagram,
      href: 'https://instagram.com/rart.creation'
    },
    {
      label: 'facebook',
      icon: faFacebookF,
      href: 'https://facebook.com/r.art.creation'
    }
  ];
  return (
    <List>
      {socialNetworks.map((network, key) => (
        <ListItem key={key}>
          <Link href={network.href} target='_blank'>
            <FontAwesomeIcon icon={network.icon} />
          </Link>
        </ListItem>
      ))}
      <ListItem>
        <Link href={ENUM_ROUTES.CONTACT}>
          <FontAwesomeIcon icon={faEnvelope as any} />
        </Link>
      </ListItem>
    </List>
  );
};
