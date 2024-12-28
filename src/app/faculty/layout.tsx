import FacultyNavbar from "@/components/FacultyNavbar";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <FacultyNavbar />
          {children}
      </body>
    </html>
  );
}
