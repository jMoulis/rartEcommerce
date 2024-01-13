import Link from 'next/link';

export default async function AccountSettingPage() {
  return (
    <span>
      <Link href='/account-settings/personal-info'>Personnal Info</Link>
    </span>
  );
}
