import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>죄송합니다, 찾을 수 없는 페이지입니다.</p>
      <Link href="/">
        홈으로 돌아가기
      </Link>
    </div>
  );
}