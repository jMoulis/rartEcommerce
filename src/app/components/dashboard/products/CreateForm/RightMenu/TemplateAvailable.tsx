import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICategory, ISection, ITemplate } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { TemplateItem } from './TemplateItem';
import styled from '@emotion/styled';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/pro-light-svg-icons';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: var(--background-section-color);
`;
const List = styled.ul`
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 10px 0 0 10px;
  border-bottom: 1px solid var(--card-header-border-color);
`;

interface Props {
  category: ICategory;
  onSelectTemplateSections: (sections: ISection[]) => void;
}

export const TemplateAvailable = ({
  category,
  onSelectTemplateSections,
}: Props) => {
  const { onFetchDocsByIdsArray } = useFirestore();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(
    null
  );
  const t = useTranslations();

  useEffect(() => {
    if (category?._id && category?.templates?.length) {
      onFetchDocsByIdsArray(category.templates, ENUM_COLLECTIONS.TEMPLATES)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setTemplates(data);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
  }, [category?._id, category?.templates]);

  useEffect(() => {
    if (templates?.length && !selectedTemplate) {
      const [defaultTemplate] = templates;
      setSelectedTemplate(defaultTemplate);
    }
  }, [templates, selectedTemplate]);

  return (
    <Root>
      <List>
        {templates.map((template, key) => (
          <li key={key}>
            <Button
              style={{
                margin: '0',
                borderRadius: '10px 10px 0 0',
                backgroundColor:
                  template._id !== selectedTemplate?._id
                    ? 'var(--disable-block-color)'
                    : 'var(--purple-color)',
              }}
              onClick={() => setSelectedTemplate(template)}>
              {template.title}
            </Button>
          </li>
        ))}
      </List>
      <Button
        onClick={() =>
          onSelectTemplateSections(selectedTemplate?.sections ?? [])
        }
        style={{
          marginLeft: '15px',
        }}>
        <FontAwesomeIcon
          icon={faUpload}
          style={{
            marginRight: '10px',
          }}
        />
        {t('commons.select')}
      </Button>
      {selectedTemplate ? <TemplateItem template={selectedTemplate} /> : null}
    </Root>
  );
};
