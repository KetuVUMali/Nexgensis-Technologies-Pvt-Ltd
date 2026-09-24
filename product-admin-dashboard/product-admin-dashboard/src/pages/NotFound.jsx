import NotFoundBlock from '../components/NotFoundBlock';
import usePageTitle from '../hooks/usePageTitle';

// Shown for any URL that does not match a route, e.g. /banana
export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <NotFoundBlock title="Page not found" message="The page you are looking for does not exist or was moved." />
    </div>
  );
}
