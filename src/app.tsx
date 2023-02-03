import { type FC, StrictMode } from 'react';
import 'uno.css';
import '~/assets/style/reset.css';

const routes = Object.entries(
  import.meta.glob('./pages/**/*.page.tsx') as Record<string, () => Promise<{ Page: FC }>>,
).map(([path, component]) => {
  const url = path
    .replace('./pages', '')
    .replace(/(index)?\.page\.tsx/, '')
    .replace(/\/\/+/, '/');

  const FullComponent = lazy(() => component().then((v) => ({ default: v.Page })));

  return (
    <Route path={url} key={url}>
      {(params: object) => (
        <Suspense>
          <FullComponent {...params} />
        </Suspense>
      )}
    </Route>
  );
});

export function App() {
  return (
    <StrictMode>
      <div className="font-sans min-h-screen">
        {routes}
      </div>
    </StrictMode>
  );
}

export default App;
