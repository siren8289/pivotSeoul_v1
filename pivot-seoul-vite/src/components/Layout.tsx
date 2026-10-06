// 모든 페이지에 공통인 상단 바와 테마 전환 버튼을 제공하고 하위 라우트를 Outlet에 렌더링합니다.
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../context/useTheme';

export default function Layout() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/">PIVOT SEOUL</Link>
        <nav aria-label="주요 메뉴">
          <Link to="/models">모델 비교</Link>
          <button type="button" onClick={toggle} aria-pressed={theme === 'dark'}>{theme === 'dark' ? '라이트 모드' : '다크 모드'}</button>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
