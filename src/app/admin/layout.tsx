export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for login page - don't require auth
  // The actual protection will be on individual admin pages
  return <>{children}</>;
}
