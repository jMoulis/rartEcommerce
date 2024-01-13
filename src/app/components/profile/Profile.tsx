'use client';
import emotionStyled from '@emotion/styled';

const Form = emotionStyled.form``;

export const Profile = () => {
  return (
    <Form>
      <label>
        Email
        <input name='email' />
      </label>
      <label>
        Email
        <input name='email' />
      </label>
    </Form>
  );
};
