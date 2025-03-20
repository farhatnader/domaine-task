import {Aside} from '~/components/Aside';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  children = null,
}) {
  return (
    <Aside.Provider>
      <main>{children}</main>
    </Aside.Provider>
  );
}
