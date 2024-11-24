import React, { useMemo, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/pro-light-svg-icons';

const Root = styled.ul`
  margin-top: 20px;
`;
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid var(--card-header-border-color);
`;

interface Props {
  progressList: Record<string, number>;
  files: FileList | null;
  errors: Record<string, any>;
}

export const ProgressionUploadingFile = ({
  progressList,
  files,
  errors
}: Props) => {
  const previews = useMemo(() => {
    if (files) {
      return Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
    }
    return [];
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  const renderProgress = useCallback(
    (fileName: string) => {
      const progress = progressList[fileName];
      const error = errors[fileName];

      if (error) {
        return (
          <FontAwesomeIcon
            icon={faExclamationCircle as any}
            style={{ color: 'red' }}
          />
        );
      }
      if (typeof progress === 'undefined') return null;
      if (progress === 100) {
        return (
          <FontAwesomeIcon
            icon={faCheckCircle as any}
            style={{ color: 'blue' }}
          />
        );
      }
      return <span style={{ fontSize: '13px' }}>{progress}%</span>;
    },
    [progressList, errors]
  );

  return (
    <Root>
      {previews.map((preview, index) => (
        <ListItem key={index}>
          <Flexbox alignItems='center'>
            <Image
              src={preview.url}
              alt={preview.name}
              width={30}
              height={30}
              style={{
                borderRadius: '5px',
                objectFit: 'cover',
                marginRight: '10px'
              }}
            />
            <span
              style={{
                fontSize: '13px'
              }}>
              {preview.name}
            </span>
          </Flexbox>
          {renderProgress(preview.name)}
        </ListItem>
      ))}
    </Root>
  );
};
